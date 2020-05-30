class TileGrid {

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
    
    west.cube.scaleMatrix.setScale(0.5, 10, 0.5);
    north.cube.scaleMatrix.setScale(9, 0.5, 0.5);
    east.cube.scaleMatrix.setScale(0.5, 10, 0.5);

    west.cube.positionMatrix.setTranslate(-9, 0, 0);
    north.cube.positionMatrix.setTranslate(0, 10, 0);
    east.cube.positionMatrix.setTranslate(9, 0, 0);

    return [west, north, east];
  }
}
