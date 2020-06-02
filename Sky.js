class Sky extends GameObject{
  constructor() {
    super();

    // Fully opaque initially
    this.model = new Cube();
    this.model.textureNum = 3;
    this.model.hasLighting = 0;
    this.scale(30, 30, 30);
  }
}
