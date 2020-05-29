class Ball {

  constructor() {
    this.sphere = new Sphere();
    this.velocity = new Vector3([-0.05, 0, 0]);

    this.sphere.modelMatrix.translate(2, 0, 0); // Inital position
    this.sphere.modelMatrix.scale(0.2, 0.2, 0.2);
  }

  move() {
    let x = this.velocity.elements[0];
    let y = this.velocity.elements[1];
    let z = this.velocity.elements[2];

    this.sphere.modelMatrix.translate(x, y, z);
  }

  position() {
    let x = this.sphere.modelMatrix.elements[12];
    let y = this.sphere.modelMatrix.elements[13];
    let z = this.sphere.modelMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
