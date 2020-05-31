// Vertex shader
var VSHADER_SOURCE =
  `
  attribute vec3 a_Position;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix; 
  uniform mat4 u_ViewMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
  }
  `;

// Fragment shader
var FSHADER_SOURCE =
  `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Hardcoded as red
  }
  `;

const SLIDER_LENGTH = 100;
const MAX_SENSITIVITY = 0.1;

const CUBE = 0; // ints used for identifying the current model in the vertex buffer
const SPHERE = 1;

let g_mouseSensitivity = MAX_SENSITIVITY / 2;
let g_gameStarted = false;

let canvas;
let gl;

let g_dataPerVertex = 12;
let g_camera = new Camera();

let g_ball = new Ball();
let g_paddle = new Paddle();

let g_tiles;
let g_walls;

let a_Position;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;

function main() {
  // WebGL and GLSL setup
  setupWebGL();
  initalizeShaders();
  connectVariablesToGLSL();
  setupBuffer();

  setupHTMLElements();
  setupControls();

  g_tiles = TileGrid.generateGrid(7, 7, 0.3);
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

function startGame() {
  g_gameStarted = true;
  g_ball.velocity = new Vector3([0.05, 0.05, 0]);
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
      startGame();
    }
  });
}

function setupHTMLElements() {
    document.getElementById("sensitivity").oninput = function() {
      g_mouseSensitivity = this.value / SLIDER_LENGTH * MAX_SENSITIVITY;
    };
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
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
}

function initalizeShaders() {
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
