const EDGE_X = 9;
const EDGE_Y = 10.4; 
const WALL_THICKNESS = 0.5;

class TileGrid {
  static get EDGE_X (){return EDGE_X;}
  static get EDGE_Y (){return EDGE_Y;}
  static get WALL_THICKNESS (){return WALL_THICKNESS;}

  static generateGrid(rows, cols, margin) {
    let tiles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let t = new Tile();
        let width = t.cube.scaleMatrix.elements[0] * 2;
        let height = t.cube.scaleMatrix.elements[5] * 2;

        let x = -(margin * ((cols - 1) / 2) + width * ((cols - 1) / 2)) + c * (width + margin);
        let y = -(margin * ((rows - 1) / 2) + height * ((rows - 1) / 2)) + r * (height + margin);
        let z = 0;

        t.cube.positionMatrix.translate(x, y, z);

        tiles.push(t);
      } 
    }

    return tiles;
  }

  static generateWalls() {
    let west = new Tile(); 
    let north = new Tile(); 
    let east = new Tile(); 

    // We'll probably adjust all these numbers later
    
    west.cube.scaleMatrix.setScale(WALL_THICKNESS, 10, WALL_THICKNESS);
    north.cube.scaleMatrix.setScale(9, WALL_THICKNESS, WALL_THICKNESS);
    east.cube.scaleMatrix.setScale(WALL_THICKNESS, 10, WALL_THICKNESS);

    west.cube.positionMatrix.setTranslate(-this.EDGE_X, 0, 0);
    north.cube.positionMatrix.setTranslate(0, this.EDGE_Y, 0);
    east.cube.positionMatrix.setTranslate(this.EDGE_X, 0, 0);

    return [west, north, east];
  }
}
