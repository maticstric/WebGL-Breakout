class Wall extends GameObject{
  static get length() {return 1;}
  // TODO add helper methods for collision detection

  constructor() {
    super();

    this.model = new Cube();
    this.model.textureNum = 2;
  }
}
