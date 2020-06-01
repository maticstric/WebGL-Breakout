class TileGrid {
  static get EDGE_X() {return 9;}
  static get EDGE_Y() {return 10.54;}
  static get WALL_THICKNESS() {return 0.5;}

  static get eastEdge(){return TileGrid.EDGE_X - TileGrid.WALL_THICKNESS;}
  static get westEdge(){return -TileGrid.EDGE_X + TileGrid.WALL_THICKNESS;}

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
    
    west.scale(TileGrid.WALL_THICKNESS, TileGrid.EDGE_Y, TileGrid.WALL_THICKNESS);
    north.scale(TileGrid.EDGE_X, TileGrid.WALL_THICKNESS, TileGrid.WALL_THICKNESS);
    east.scale(TileGrid.WALL_THICKNESS, TileGrid.EDGE_Y, TileGrid.WALL_THICKNESS);

    west.translate(-TileGrid.EDGE_X, 0, 0);
    north.translate(0, TileGrid.EDGE_Y, 0);
    east.translate(TileGrid.EDGE_X, 0, 0);

    return [west, north, east];
  }
}
