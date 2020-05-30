// Length from the middle of the paddle
const LENGTH = 1.3;

class Paddle {
  static get LENGTH(){return LENGTH;}

  constructor() {
    this.cube = new Cube();

    // Position variable for easier acces to coordinates
    this.position = this.cube.positionMatrix.elements;

    this.cube.positionMatrix.setTranslate(0, -9.5, 0); // Inital position
    this.cube.scaleMatrix.setScale(LENGTH, 0.3, 0.3);
  }

  mouseMove(moveDirection) {
    let position = this.cube.positionMatrix.elements;
    this.cube.positionMatrix.translate(moveDirection, 0, 0);

    // Keep paddle from going off the right edge
    if (position[X] + LENGTH > TileGrid.EDGE_X - TileGrid.WALL_THICKNESS) {
      position[X] = TileGrid.EDGE_X - TileGrid.WALL_THICKNESS - LENGTH;
    }

    // Keep paddle from going off the left edge
    if (position[X] - LENGTH < -TileGrid.EDGE_X + TileGrid.WALL_THICKNESS) {
      position[X] = -TileGrid.EDGE_X + TileGrid.WALL_THICKNESS + LENGTH;
    }
  }

  position() {
    let x = this.cube.positionMatrix.elements[12];
    let y = this.cube.positionMatrix.elements[13];
    let z = this.cube.positionMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
