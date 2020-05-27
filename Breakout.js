// Vertex shader
var VSHADER_SOURCE =
  `
  void main() {

  }
  `;

// Fragment shader
var FSHADER_SOURCE =
  `
  void main() {

  }
  `;

function main() {
  setupWebGL();
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

}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas, false);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {

}

function setupBuffer() {

}
