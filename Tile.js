class Tile extends GameObject{
  static get length() {return 1;}

  constructor() {
    super();

    this.model = new Cube();
  }
}
