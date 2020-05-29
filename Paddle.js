class Paddle {

  constructor() {
    this.cube = new Cube();

    this.cube.positionMatrix.setTranslate(0, -9.5, 0); // Inital position
    this.cube.scaleMatrix.setScale(1.3, 0.3, 0.3);
    console.log("paddle", this.cube.positionMatrix);
  }

  mouseMove(moveDirection) {
    this.cube.positionMatrix.translate(moveDirection, 0, 0);
  }

  position() {
    let x = this.cube.modelMatrix.elements[12];
    let y = this.cube.modelMatrix.elements[13];
    let z = this.cube.modelMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}