class TileGrid {
  static get WALL_X() {return 9;}
  static get WALL_Y() {return 10.1;}
  static get WALL_RADIUS() {return 0.5;}

  static get eastEdge(){return TileGrid.WALL_X - TileGrid.WALL_RADIUS;}
  static get westEdge(){return -TileGrid.WALL_X + TileGrid.WALL_RADIUS;}

  static generateLevel1(rows, cols, margin) {
    let tiles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let t = new Tile();

        let width = t.width;
        let height = t.height;

        let x = -(margin * ((cols - 1) / 2) + width * ((cols - 1) / 2)) + c * (width + margin);
        let y = -(margin * ((rows - 1) / 2) + height * ((rows - 1) / 2)) + r * (height + margin);
        let z = 0;

        t.model.positionMatrix.translate(x, y, z);

        tiles.push(t);
      } 
    }

    g_tilesOriginalLength = tiles.length;

    return tiles;
  }

  static generateLevel2(rows, cols, margin) {
    let tiles = [];

    for (let r = 0; r < rows; r += 2) {
      for (let c = 0; c < cols; c++) {
        let t = new Tile();

        let width = t.width;
        let height = t.height;

        let x = -(margin * ((cols - 1) / 2) + width * ((cols - 1) / 2)) + c * (width + margin);
        let y = -(margin * ((rows - 1) / 2) + height * ((rows - 1) / 2)) + r * (height + margin);
        let z = 0;

        t.model.positionMatrix.translate(x, y, z);

        tiles.push(t);
      } 
    }

    g_tilesOriginalLength = tiles.length;

    return tiles;
  }

  static generateLevel3(rows, cols, margin) {
    let tiles = [];

    for (let r = 0; r < rows; r += 2) {
      for (let c = 0; c < cols; c += 2) {
        let t = new Tile();

        let width = t.width;
        let height = t.height;

        let x = -(margin * ((cols - 1) / 2) + width * ((cols - 1) / 2)) + c * (width + margin);
        let y = -(margin * ((rows - 1) / 2) + height * ((rows - 1) / 2)) + r * (height + margin);
        let z = 0;

        t.model.positionMatrix.translate(x, y, z);

        tiles.push(t);
      } 
    }

    g_tilesOriginalLength = tiles.length;

    return tiles;
  }

  static generateWalls() {
    let west = new Wall(); 
    let north = new Wall(); 
    let east = new Wall(); 

    // We'll probably adjust all these numbers later
    
    west.scale(TileGrid.WALL_RADIUS, TileGrid.WALL_Y + TileGrid.WALL_RADIUS, 
      TileGrid.WALL_RADIUS);
    north.scale(TileGrid.WALL_X + TileGrid.WALL_RADIUS, TileGrid.WALL_RADIUS, 
      TileGrid.WALL_RADIUS);
    east.scale(TileGrid.WALL_RADIUS, TileGrid.WALL_Y + TileGrid.WALL_RADIUS, 
      TileGrid.WALL_RADIUS);

    west.translate(-TileGrid.WALL_X, 0, 0);
    north.translate(0, TileGrid.WALL_Y, 0);
    east.translate(TileGrid.WALL_X, 0, 0);

    return [west, north, east];
  }
}
