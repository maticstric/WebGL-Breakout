class Tile extends GameObject{
  constructor() {
    super();

    // Fully opaque initially
    this.model = new Cube();
    this.model.textureNum = 1;

    this.scale(1, 0.3, 0.3);
  }
}
