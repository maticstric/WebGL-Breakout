// Length from the middle of the paddle
const PADDLE_LENGTH = 1.3;

class Paddle {
  get rightEdge(){return this.position[X] + PADDLE_LENGTH;}
  get leftEdge(){return this.position[X] - PADDLE_LENGTH;}

  constructor() {
    this.cube = new Cube();

    // Position variable for easier acces to coordinates
    this.position = this.cube.positionMatrix.elements;

    this.cube.positionMatrix.setTranslate(0, -9.5, 0); // Inital position
    this.cube.scaleMatrix.setScale(PADDLE_LENGTH, 0.3, 0.3);
  }

  mouseMove(moveDirection) {
    this.cube.positionMatrix.translate(moveDirection, 0, 0);

    // Keep paddle from going off the right edge
    if (this.rightEdge > TileGrid.eastEdge) {
      this.position[X] = TileGrid.eastEdge - PADDLE_LENGTH;
    }

    // Keep paddle from going off the left edge
    if (this.leftEdge < TileGrid.westEdge) {
      this.position[X] = TileGrid.westEdge + PADDLE_LENGTH;
    }
  }

  position() {
    let x = this.cube.positionMatrix.elements[12];
    let y = this.cube.positionMatrix.elements[13];
    let z = this.cube.positionMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
