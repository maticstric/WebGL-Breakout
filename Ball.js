class Ball extends GameObject{
  get velocityX() {return this.velocity.elements[0];}
  get velocityY() {return this.velocity.elements[1];}
  get velocityZ() {return this.velocity.elements[2];}

  constructor() {
    super();
    this.model = new Sphere();
    this.velocity = new Vector3([0, 0, 0]);

    this.translate(0, -8.75, 0); // Inital position
    this.scale(0.35, 0.35, 0.35);
  }

  move() {
    if (g_gameStarted) {
      // Update position based on velocity if the game has started
      this.translate(this.velocityX, this.velocityY, this.velocityZ);
    } else {
      // Otherwise constrain it to the paddle
      this.positionX =  g_paddle.positionX;
    }
  }

}
