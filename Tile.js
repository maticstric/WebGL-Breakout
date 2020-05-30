// Length from the middle of the Tile
const TILE_LENGTH = 1;

class Tile {
  get leftEdge(){return this.position[X] - TILE_LENGTH;}

  constructor() {
    this.cube = new Cube();

    // Position variable for easier acces to coordinates
    this.position = this.cube.positionMatrix.elements;

    this.cube.positionMatrix.setTranslate(0, 0, 0); // Initial position
    this.cube.scaleMatrix.setScale(TILE_LENGTH, 0.3, 0.3);
  }

  position() {
    let x = this.cube.positionMatrix.elements[12];
    let y = this.cube.positionMatrix.elements[13];
    let z = this.cube.positionMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
