class Tile extends GameObject{
  static get length() {return 1;}
  // TODO add helper methods for collision detection

  constructor() {
    super();

    this.model = new Cube();
  }
}
