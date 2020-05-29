class Ball {

  constructor() {
    this.sphere = new Sphere();
    this.velocity = new Vector3([-0.05, 0, 0]);
    this.position = new Vector3([2, 0, 0]);

    // Some initialization
    let x = this.position.elements[0];
    let y = this.position.elements[1];
    let z = this.position.elements[2];

    this.sphere.modelMatrix.translate(x, y, z);
    this.sphere.modelMatrix.scale(0.2, 0.2, 0.2);

    console.log(this.sphere.modelMatrix);
  }

  move() {
    this.position.add(this.velocity);

    let x = this.velocity.elements[0];
    let y = this.velocity.elements[1];
    let z = this.velocity.elements[2];

    this.sphere.modelMatrix.translate(x, y, z);
  }
}
