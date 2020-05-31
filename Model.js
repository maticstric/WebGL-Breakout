class Model {

  constructor() {
    this.positionMatrix = new Matrix4();
    this.scaleMatrix = new Matrix4();
    this.vertices = [];
    this.textureNum = -1;
    this.textureWeight = 1;
  }

  render() {
    let modelMatrix = new Matrix4();
    modelMatrix.set(this.positionMatrix);
    modelMatrix.multiply(this.scaleMatrix);

    // Put model into buffer
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
 
    // Computer normal matrix
    let normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // Set all uniforms
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniform1f(u_TextureWeight, this.textureWeight);
    gl.uniform1i(u_TextureNum, this.textureNum);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / g_dataPerVertex);
  }

}
