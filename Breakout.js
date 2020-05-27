// Vertex shader
var VSHADER_SOURCE =
  `
  attribute vec3 a_Position;

  uniform mat4 u_ModelMatrix;

  void main() {
    gl_Position = u_ModelMatrix * vec4(a_Position, 1.0);
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

let canvas;
let gl;

let dataPerVertex = 3; // How much data we send per vertex (3 rn b/c we only send position)

let a_Position;
let u_ModelMatrix;

function main() {
  setupWebGL();
  initalizeShaders();
  connectVariablesToGLSL();
  setupBuffer();

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

  /* CUBES */
  gl.bufferData(gl.ARRAY_BUFFER, Cube.vertices, gl.STATIC_DRAW);

  let cube = new Cube();
  cube.modelMatrix.rotate(45, 0, 1, 0);
  cube.modelMatrix.rotate(45, 1, 0, 1);
  cube.modelMatrix.scale(0.5, 0.5, 0.5);

  gl.uniformMatrix4fv(u_ModelMatrix, false, cube.modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES, 0, Cube.vertices.length / dataPerVertex);
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

  let FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;

  // Assign the buffer object to a_Position variable and enable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, dataPerVertex * FLOAT_SIZE, 0);
  gl.enableVertexAttribArray(a_Position);
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
