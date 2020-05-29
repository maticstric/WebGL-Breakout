class Tile {

  constructor() {
    this.cube = new Cube();

    this.cube.modelMatrix.translate(-2, 0, 0); // Initial position
    this.cube.modelMatrix.scale(0.2, 0.1, 0.1);
  }

  position() {
    let x = this.cube.modelMatrix.elements[12];
    let y = this.cube.modelMatrix.elements[13];
    let z = this.cube.modelMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
