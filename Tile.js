class Tile extends GameObject{
  static get length() {return 1;}

  constructor() {
    super();

    this.model = new Cube();

    this.scale(Tile.length, 0.3, 0.3);
  }
}
