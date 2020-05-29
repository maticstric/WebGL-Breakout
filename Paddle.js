class Paddle {

  constructor() {
    this.cube = new Cube();

    // TODO place into position
    this.cube.modelMatrix.translate(0, -9.5, 0); // Inital position
    // TODO scale to desired size
    this.cube.modelMatrix.scale(1.3, 0.3, 0.3);
  }

  mouseMove(moveDirection) {
    this.cube.modelMatrix.translate(moveDirection, 0, 0);
  }

  position() {
    let x = this.cube.modelMatrix.elements[12];
    let y = this.cube.modelMatrix.elements[13];
    let z = this.cube.modelMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
