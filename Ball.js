class Ball {

  constructor() {
    this.sphere = new Sphere();
    this.velocity = new Vector3([0, 0, 0]);

    this.sphere.positionMatrix.setTranslate(0, -8.75, 0); // Inital position
    this.sphere.scaleMatrix.setScale(0.35, 0.35, 0.35);
    //this.sphere.scaleMatrix.translate(0, -8.75, 0);
    //this.sphere.scaleMatrix.scale(0.35, 0.35, 0.35);
    console.log("ball", this.sphere.scaleMatrix);
  }

  mouseMove(moveDirection){
    this.sphere.positionMatrix.translate(moveDirection, 0, 0);
  }

  move() {
    let x = this.velocity.elements[0];
    let y = this.velocity.elements[1];
    let z = this.velocity.elements[2];

    this.sphere.positionMatrix.translate(x, y, z);
  }

  position() {
    let x = this.sphere.modelMatrix.elements[12];
    let y = this.sphere.modelMatrix.elements[13];
    let z = this.sphere.modelMatrix.elements[14];

    return new Vector3([x, y, z]);
  }
}
