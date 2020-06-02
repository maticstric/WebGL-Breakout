class Sky extends GameObject{
  constructor(size, textureNum) {
    super();

    this.model = new Cube();
    this.model.hasLighting = 0;
    this.model.textureNum = textureNum;
    this.scale(size, size, size);
  }
}
