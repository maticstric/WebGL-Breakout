class Cube extends Model{
  static vertices = new Float32Array([
      // Front
       1, -1, -1,
      -1, -1, -1,
      -1,  1, -1,
       1, -1, -1,
      -1,  1, -1,
       1,  1, -1,

      // Top
       1,  1, -1,
      -1,  1, -1,
      -1,  1,  1,
       1,  1, -1,
      -1,  1,  1,
       1,  1,  1,

      // Back 
       1, -1,  1,
      -1, -1,  1,
      -1,  1,  1,
       1, -1,  1,
      -1,  1,  1,
       1,  1,  1,

      // Bottom
       1, -1, -1,
      -1, -1, -1,
      -1, -1,  1,
       1, -1, -1,
      -1, -1,  1,
       1, -1,  1,

      // Right 
       1, -1,  1,
       1, -1, -1,
       1,  1, -1,
       1, -1,  1,
       1,  1, -1,
       1,  1,  1,

      // Left 
      -1, -1,  1,
      -1, -1, -1,
      -1,  1, -1,
      -1, -1,  1,
      -1,  1, -1,
      -1,  1,  1
  ]);

  constructor() {
    super();
  }

  render() {
    var modelMatrix = this.positionMatrix.multiply(this.scaleMatrix);

    // To avoid rentering the same set of vertices into the vertex buffer
    if (g_modelInBuffer != CUBE) {
      gl.bufferData(gl.ARRAY_BUFFER, Cube.vertices, gl.STATIC_DRAW);
      g_modelInBuffer = CUBE;
    }

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, Cube.vertices.length / g_dataPerVertex);
  }
}
