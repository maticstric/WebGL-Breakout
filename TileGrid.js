const EDGE_X = 9;
const EDGE_Y = 10.4; 
// Thickness from the middle of the wall
const WALL_THICKNESS = 0.5;

class TileGrid {
  static get eastEdge(){return EDGE_X - WALL_THICKNESS;}
  static get westEdge(){return -EDGE_X + WALL_THICKNESS;}

  static generateGrid(rows, cols, margin) {
    let tiles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let t = new Tile();
        t.scale(Tile.length, 0.3, 0.3);

        let width = t.width;
        let height = t.height;

        let x = -(margin * ((cols - 1) / 2) + width * ((cols - 1) / 2)) + c * (width + margin);
        let y = -(margin * ((rows - 1) / 2) + height * ((rows - 1) / 2)) + r * (height + margin);
        let z = 0;

        t.model.positionMatrix.translate(x, y, z);

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
    
    west.scale(WALL_THICKNESS, 10, WALL_THICKNESS);
    north.scale(9, WALL_THICKNESS, WALL_THICKNESS);
    east.scale(WALL_THICKNESS, 10, WALL_THICKNESS);

    west.translate(-EDGE_X, 0, 0);
    north.translate(0, EDGE_Y, 0);
    east.translate(EDGE_X, 0, 0);

    return [west, north, east];
  }
}
