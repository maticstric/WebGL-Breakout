class Tile extends GameObject{
  static get length() {return 1;}
  // TODO add helper methods for collision detection

  constructor() {
    super();

    // Fully opaque initially
    this.model = new Cube([0, 0, 0, 1]);
    this.model.textureNum = 1;

    this.scale(1, 0.3, 0.3);
  }
}
