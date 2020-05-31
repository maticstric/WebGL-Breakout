class Sphere extends Model{
  static get DIVISION() {return 10;}

  constructor(color) {
    super();
    this.vertices = initVertices(color);
  }

  initVertices(color) {
    let vertices = [];
    let d = Math.PI / Sphere.DIVISION;

    for (let t = 0; t < Math.PI; t += d) {
      for (let r = 0; r < 2 * Math.PI; r += d) {
        let p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
        let p2 = [Math.sin(t + d) * Math.cos(r), Math.sin(t + d) * Math.sin(r), Math.cos(t + d)];
        let p3 = [Math.sin(t) * Math.cos(r + d), Math.sin(t) * Math.sin(r + d), Math.cos(t)];
        let p4 = [Math.sin(t + d) * Math.cos(r + d), Math.sin(t + d) * Math.sin(r + d), Math.cos(t + d)];

        let uv1 = [t/Math.PI, r/(2*Math.PI)];
        let uv2 = [(t+d)/Math.PI, r/(2*Math.PI)];
        let uv3 = [t/Math.PI, (r+d)/(2*Math.PI)];
        let uv4 = [(t+d)/Math.PI, (r+d)/(2*Math.PI)];

        vertices = vertices.concat(p1, uv1, color, p1);
        vertices = vertices.concat(p2, uv2, color, p2);
        vertices = vertices.concat(p4, uv4, color, p4);

        vertices = vertices.concat(p1, uv1, color, p1);
        vertices = vertices.concat(p4, uv4, color, p4);
        vertices = vertices.concat(p3, uv3, color, p3);
      }
    }

    return new Float32Array(vertices);
  }
}
