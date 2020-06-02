// Vertex shader
var VSHADER_SOURCE =`
  precision mediump float;

  attribute vec3 a_Position;
  attribute vec2 a_UV;
  attribute vec4 a_Color;
  attribute vec3 a_Normal;

  varying vec3 v_Position;
  varying vec2 v_UV;
  varying vec4 v_Color;
  varying vec3 v_Normal;

  uniform mat4 u_NormalMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix; 
  uniform mat4 u_ViewMatrix;

  void main() {
    v_UV = a_UV;
    v_Color = a_Color;
    v_Normal = vec3(u_NormalMatrix * vec4(a_Normal, 1.0));
    v_Position = vec3(u_ModelMatrix * vec4(a_Position, 1.0));

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
  }`;

// Fragment shader
var FSHADER_SOURCE = `
  precision mediump float;

  varying vec3 v_Position;
  varying vec2 v_UV;
  varying vec4 v_Color;
  varying vec3 v_Normal;

  uniform float u_TextureWeight;
  uniform int u_TextureNum;
  // Copy pasted, remove any not needed
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform vec3 u_LightPosition;
  uniform vec3 u_CameraPosition;

  void main() {
    // Calculate combined texture and base color
    float t = u_TextureWeight;
    vec4 texColor;
    vec4 vertexColor = v_Color;
    vec4 baseColor;

    if (u_TextureNum == 0) {
      texColor = texture2D(u_Sampler0, v_UV); // use texture0
      baseColor = (1.0 - t) * vertexColor + t * texColor;
    } else if (u_TextureNum == 1) {
      texColor = texture2D(u_Sampler1, v_UV); // use texture1
      baseColor = (1.0 - t) * vertexColor + t * texColor;
    } else if (u_TextureNum == 2) {
      texColor = texture2D(u_Sampler2, v_UV); // use texture2
      baseColor = (1.0 - t) * vertexColor + t * texColor;
    } else {
      baseColor = vertexColor;
    }

    gl_FragColor = baseColor;

    // Lighting
    vec3 normal = normalize(v_Normal);
    vec3 lightDirection = normalize(u_LightPosition - v_Position);
    vec3 reflect = reflect(-lightDirection, normal);
    vec3 cameraDirection = normalize(u_CameraPosition - v_Position);

    float nDotL = max(dot(normal, lightDirection), 0.0);
    float eDotR = pow(max(dot(cameraDirection, reflect), 0.0), 100.0);

    vec4 diffuse = vec4(vec3(gl_FragColor) * nDotL * 0.8, 1.0);
    vec4 ambient = vec4(vec3(gl_FragColor) * 0.6, 1.0);
    vec4 specular = vec4(vec3(gl_FragColor) * eDotR * 0.7, 1.0);

    gl_FragColor = diffuse + ambient + specular;
  }`;

const SLIDER_LENGTH = 100;
const MAX_SENSITIVITY = 0.1;
const NUM_LIVES = 3;

const CUBE = 0; // ints used for identifying the current model in the vertex buffer
const SPHERE = 1;

let g_mouseSensitivity = MAX_SENSITIVITY / 2;
let g_gameStarted = false;
let g_lives = NUM_LIVES;
let g_livesText;

let canvas;
let gl;

let g_dataPerVertex = 12;
let g_camera = new Camera();

let g_ball = new Ball();
let g_paddle = new Paddle();

let g_tiles;
let g_tilesOriginalLength;
let g_walls;

let a_Position;
let a_UV;
let a_Color;
let a_Normal;
let u_NormalMatrix;
let u_TextureWeight;
let u_TextureNum;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_LightPosition;
let u_CameraPosition;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;

function main() {
  // WebGL and GLSL setup
  setupWebGL();
  initializeShaders();
  connectVariablesToGLSL();
  setupBuffer();
  initializeTextures();

  setupHTMLElements();
  setupControls();

  g_tiles = TileGrid.generateGrid(7, 7, 0.3);
  g_tilesOriginalLength = g_tiles.length;

  g_walls = TileGrid.generateWalls();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Render
  requestAnimationFrame(tick);
}

function tick() {
  renderAllShapes();  

  requestAnimationFrame(tick);
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /* CAMERA */
  let projectionMatrix = new Matrix4();
  projectionMatrix.setPerspective(g_camera.fov, canvas.width / canvas.height, g_camera.near, g_camera.far);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);

  let viewMatrix = new Matrix4();
  viewMatrix.setLookAt(
    g_camera.eye.elements[0],     g_camera.eye.elements[1],     g_camera.eye.elements[2], 
    g_camera.lookAt.elements[0],  g_camera.lookAt.elements[1],  g_camera.lookAt.elements[2], 
    g_camera.up.elements[0],      g_camera.up.elements[1],      g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  /* FOR LIGHTING */
  gl.uniform3f(u_LightPosition, g_ball.positionX, g_ball.positionY, g_ball.positionZ);
  gl.uniform3f(u_CameraPosition, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  /* CUBES */

  // Draw tiles
  g_tiles.forEach((t) => {
    t.model.render();
  });

  // Draw walls
  g_walls.forEach((w) => {
    w.model.render();
  });
  
  // Draw g_paddle
  g_paddle.model.render(); 

  /* SPHERES */
  // Update ball position
  g_ball.move();

  // Draw g_ball
  g_ball.model.render(); 
}

function checkHasWon() {
  if (g_tiles.length == 0) {
    g_gameStarted = false;
    g_lives = NUM_LIVES;
    g_livesText.innerHTML = "You Win! 😊";
    g_tiles = TileGrid.generateGrid(7, 7, 0.3);
  }
}

function livesString() {
  let string = "";

  for (let i = 0; i < g_lives; i ++) {
    string += "❤️";
  }

  return string;
}

function startGame() {
  g_gameStarted = true;

  if (g_lives == NUM_LIVES) {
    g_livesText.innerHTML = livesString();
  }

  let randomX = Math.random() * 2 - 1; // between -1 and 1
  let randomY = Math.random() * (1 - Math.sqrt(2) / 2) + Math.sqrt(2) / 2; // between 0 and sqrt(2) / 2

  let velocity = new Vector3([randomX, randomY, 0]);
  velocity.normalize();

  if (g_ball.velocity.magnitude() === 0){
    velocity.mul(Ball.minSpeed);
  } else {
    velocity.mul(g_ball.velocity.magnitude());
  }

  g_ball.velocity = velocity;
}

function endGame(){
  g_lives --;
  g_gameStarted = false;
  g_livesText.innerHTML = livesString();

  if (g_lives == 0) {
    g_ball.velocity = new Vector3([0, 0, 0]);
    g_tiles = TileGrid.generateGrid(7, 7, 0.3);
    g_lives = NUM_LIVES;
    g_livesText.innerHTML = "Game Over 😒";
  }
}

function mouseMove(e) {
  // Only use the x direction since paddle moves horizontally
  let moveDirection = e.movementX * g_mouseSensitivity; 

  g_paddle.mouseMove(moveDirection); // Update the paddle position
}

function pointerLockChange(){
  if (document.pointerLockElement === canvas||
    document.mozPointerLockElement === canvas||
    document.webkitPointerLockElement === canvas) {
    // Pointer was just locked, enable the mousemove listener
    document.addEventListener("mousemove", mouseMove, false);
  } else {
    // Pointer was just unlocked, disable the mousemove listener
    document.removeEventListener("mousemove", mouseMove, false);
  }
}

function setupControls() {
  // Pointer lock setup to work for several browsers
  canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;
  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock;

  // Hook pointer lock state change events
  document.addEventListener('pointerlockchange', pointerLockChange, false);
  document.addEventListener('mozpointerlockchange', pointerLockChange, 
    false);
  document.addEventListener('webkitpointerlockchange', pointerLockChange, 
    false);

  // Ask the browser to lock the pointer on canvas click
  canvas.onclick = function() {
    if(document.pointerLockElement !== canvas && 
      document.mozPointerLockElement !== canvas &&
      document.webkitPointerLockElement !== canvas) { 
      canvas.requestPointerLock();
    }
  };

  // Add listener to start game
  document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      if (!g_gameStarted) {
        startGame();
      }
    }
  });
}

function setupHTMLElements() {
    document.getElementById("sensitivity").oninput = function() {
      g_mouseSensitivity = this.value / SLIDER_LENGTH * MAX_SENSITIVITY;
    };

    g_livesText = document.getElementById("lives");
  g_livesText.innerHTML = livesString();
}

function sendImageToGLSL(n, image) {
  var texture = gl.createTexture(); // Create a texture object

  if (!texture) {
      console.log('Failed to create the texture object');
      return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y axis

  // Enable the tecture unit
  switch(n){
      case 0:
          gl.activeTexture(gl.TEXTURE0);
          break;
      case 1:
          gl.activeTexture(gl.TEXTURE1);
          break;
      case 2:
          gl.activeTexture(gl.TEXTURE2);
          break;
  }

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the tecture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture until 0 to the sampler
  switch(n){
      case 0:
          gl.uniform1i(u_Sampler0, 0);
          break;
      case 1:
          gl.uniform1i(u_Sampler1, 1);
          break;
      case 2:
          gl.uniform1i(u_Sampler2, 2);
          break;
  }
}

function initializeTextures() {
  var image0 = new Image(); // Create the Image object
  if (!image0) {
      console.log('Failed to create the image object');
      return false;
  }

  var image1 = new Image();
  if (!image1) {
      console.log('Failed to create the image object');
      return false;
  }

  var image2 = new Image();
  if (!image2) {
      console.log('Failed to create the image object');
      return false;
  }

  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendImageToGLSL(0, image0); };
  image1.onload = function(){ sendImageToGLSL(1, image1); };
  image2.onload = function(){ sendImageToGLSL(2, image2); };

  // Tell the browser to load the image
  image0.src = 'textures/paddle.png';
  image1.src = 'textures/tile.png';
  image2.src = 'textures/wall.png';
  
  return true;
}

function setupBuffer() {
  // Create a buffer object
  let vertexBuffer = gl.createBuffer();
  if(!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  let F_SIZE = Float32Array.BYTES_PER_ELEMENT;

  // Assign the buffer object to a_Position variable and enable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE * g_dataPerVertex, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_UV variable and enable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, F_SIZE * g_dataPerVertex, 3 * F_SIZE);
  gl.enableVertexAttribArray(a_UV);

  // Assign the buffer object to a_Color variable and enable
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, F_SIZE * g_dataPerVertex, 5 * F_SIZE);
  gl.enableVertexAttribArray(a_Color);

  // Assign the buffer object to a_Normal variable and enable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, F_SIZE * g_dataPerVertex, 9 * F_SIZE);
  gl.enableVertexAttribArray(a_Normal);
}

function connectVariablesToGLSL() {
  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    //return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    //return;
  }

  // Get the storage location of a_Color
  a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    //return;
  }

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    //return;
  }

  // Get the storage location of u_TextureWeight
  u_TextureWeight = gl.getUniformLocation(gl.program, 'u_TextureWeight');
  if (!u_TextureWeight) {
    console.log('Failed to get the storage location of u_TextureWeight');
    //return;
  }

  // Get the storage location of u_TextureNum
  u_TextureNum = gl.getUniformLocation(gl.program, 'u_TextureNum');
  if (!u_TextureNum) {
    console.log('Failed to get the storage location of u_TextureNum');
    //return;
  }

  // Get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    //return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    //return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    //return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    //return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

  if(!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
  }

  // Get the storage location of u_Sampler
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

  if(!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
  }

  // Get the storage location of u_Sampler
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');

  if(!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
  }

  // Get the storage location of u_LightPosition
  u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');

  if (!u_LightPosition) {
    console.log('Failed to get the storage location of u_LightPosition');
  }

  // Get the storage location of u_CameraPosition
  u_CameraPosition = gl.getUniformLocation(gl.program, 'u_CameraPosition');

  if (!u_CameraPosition) {
    console.log('Failed to get the storage location of u_CameraPosition');
  }
}

function initializeShaders() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl', false);

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas, false);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}
