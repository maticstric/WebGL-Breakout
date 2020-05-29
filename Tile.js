class Tile {

  constructor() {
    this.cube = new Cube();
    this.position = new Vector3([-2, 0, 0]);

    // Some initialization
    let x = this.position.elements[0];
    let y = this.position.elements[1];
    let z = this.position.elements[2];

    this.cube.modelMatrix.translate(x, y, z);
    this.cube.modelMatrix.scale(0.2, 0.1, 0.1);

    console.log(this.cube.modelMatrix);
  }
}
