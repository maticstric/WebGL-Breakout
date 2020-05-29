class TileGrid {

  static generateGrid(rows, cols, margin) {
    let tiles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let t = new Tile();
        let width = t.cube.scaleMatrix.elements[0] * 2;
        let height = t.cube.scaleMatrix.elements[5] * 2;

        //let x = -(((cols / 2) * width / 2) + ((cols / 2) * (margin / 2))) + c * (width + margin);
        let x = -(margin * ((cols - 1) / 2) + width * ((cols - 1) / 2)) + c * (width + margin);
        let y = -(margin * ((rows - 1) / 2) + height * ((rows - 1) / 2)) + r * (height + margin);
        let z = 0;

        console.log(y);

        t.cube.positionMatrix.translate(x, y, z);

        tiles.push(t);
      } 
    }

    return tiles;
  }
}
