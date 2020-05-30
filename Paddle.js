// Length from the middle of the paddle

class Paddle extends GameObject{
  static get length() {return 1.3;}

  get leftEdge() {return this.positionX - Paddle.length;}
  get rightEdge() {return this.positionX + Paddle.length;}

  constructor() {
    super();
    this.model = new Cube();

    this.model.positionMatrix.setTranslate(0, -9.5, 0); // Inital position
    this.model.scaleMatrix.setScale(this.constructor.length, 0.3, 0.3);
  }

  mouseMove(moveDirection) {
    this.model.positionMatrix.translate(moveDirection, 0, 0);

    // Keep paddle from going off the right edge
    if (this.rightEdge > TileGrid.eastEdge) {
      this.positionX = TileGrid.eastEdge - Paddle.length;
    }

    // Keep paddle from going off the left edge
    if (this.leftEdge < TileGrid.westEdge) {
      this.positionX = TileGrid.westEdge + Paddle.length;
    }
  }
}
