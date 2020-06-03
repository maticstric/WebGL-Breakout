class Camera {
  constructor() {
    this.eye = new Vector3([0, 0, 26]);
    this.lookAt = new Vector3([0, 0, -100]);
    this.up = new Vector3([0, 1, 0]);

    this.fov = 45;
    this.near = 0.1;
    this.far = 500;
  }
}
