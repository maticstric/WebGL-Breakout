class Ball {

  constructor() {
    this.sphere = new Sphere();
    this.velocity = new Vector3([0, 0, 0]);

    this.sphere.positionMatrix.setTranslate(0, -8.75, 0); // Inital position
    this.sphere.scaleMatrix.setScale(0.35, 0.35, 0.35);
  }

  move() {
    if (g_gameStarted) {
      // Update position based on velocity if the game has started
      let x = this.velocity.elements[0];
      let y = this.velocity.elements[1];
      let z = this.velocity.elements[2];

      this.sphere.positionMatrix.translate(x, y, z);
    } else {
      // Otherwise constrain it to the paddle
      let position = this.sphere.positionMatrix.elements;
      position[X] =  g_paddle.position[X];
    }
  }

  position() {
    let x = this.sphere.positionMatrix.elements[12];
    let y = this.sphere.positionMatrix.elements[13];
    let z = this.sphere.positionMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
