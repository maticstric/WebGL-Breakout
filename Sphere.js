class Sphere extends Model{
  static vertices = []; // initalized after class declaration

  constructor() {
    super();
  }

  render() {
    // To avoid rentering the same set of vertices into the vertex buffer
    if (g_modelInBuffer != SPHERE) {
      gl.bufferData(gl.ARRAY_BUFFER, Sphere.vertices, gl.STATIC_DRAW);
      g_modelInBuffer = SPHERE;
    }    
   
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, Sphere.vertices.length / g_dataPerVertex);
  }
}

initVertices();

function initVertices() {
  let d = Math.PI / 10;

  for (let t = 0; t < Math.PI; t += d) {
    for (let r = 0; r < 2 * Math.PI; r += d) {
      let p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];

      let p2 = [Math.sin(t + d) * Math.cos(r), Math.sin(t + d) * Math.sin(r), Math.cos(t + d)];
      let p3 = [Math.sin(t) * Math.cos(r + d), Math.sin(t) * Math.sin(r + d), Math.cos(t)];
      let p4 = [Math.sin(t + d) * Math.cos(r + d), Math.sin(t + d) * Math.sin(r + d), Math.cos(t + d)];

      Sphere.vertices = Sphere.vertices.concat(p1);
      Sphere.vertices = Sphere.vertices.concat(p2);
      Sphere.vertices = Sphere.vertices.concat(p4);

      Sphere.vertices = Sphere.vertices.concat(p1);
      Sphere.vertices = Sphere.vertices.concat(p4);
      Sphere.vertices = Sphere.vertices.concat(p3);
    }
  }

  Sphere.vertices = new Float32Array(Sphere.vertices);
}
