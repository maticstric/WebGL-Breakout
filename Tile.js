class Tile {

  constructor() {
    this.cube = new Cube();

    this.cube.positionMatrix.setTranslate(0, 0, 0); // Initial position
    this.cube.scaleMatrix.setScale(1, 0.3, 0.3);
    console.log("tile", this.cube.positionMatrix);
  }

  position() {
    let x = this.cube.positionMatrix.elements[12];
    let y = this.cube.positionMatrix.elements[13];
    let z = this.cube.positionMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
