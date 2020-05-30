// For accessing vectors inside and outside class
const X = 0;
const Y = 1;
const Z = 2;

// For accessing matrices inside class
const MATRIX_X = 12;
const MATIRX_Y = 13;
const MATIRX_Z = 14;

class GameObject {
  translate(x, y, z) {
    this.model.positionMatrix.translate(x, y, z);
  }

  scale(x, y, z) {
    this.model.positionMatrix.scale(x, y, z);
  }

  get position() {
    let x = this.model.positionMatrix.elements[MATRIX_X];
    let y = this.model.positionMatrix.elements[MATIRX_Y];
    let z = this.model.positionMatrix.elements[MATIRX_Z];

    return new Vector3([x, y, z]);
  }

  set position(v) {
    let x = this.elements[X];
    let y = this.elements[Y];
    let z = this.elements[Z];

    this.model.positionMatrix.elements[MATRIX_X] = x;
    this.model.positionMatrix.elements[MATIRX_Y] = y;
    this.model.positionMatrix.elements[MATIRX_Z] = z;
  }

  get positionX() {
    return this.model.positionMatrix.elements[MATRIX_X];
  }

  get positionY() {
    return this.model.positionMatrix.elements[MATRIX_Y];
  }

  get positionZ() {
    return this.model.positionMatrix.elements[MATRIX_Z];
  }

  set positionX(n) {
    this.model.positionMatrix.elements[MATRIX_X] = n;
  }

  set positionY(n) {
    this.model.positionMatrix.elements[MATRIX_Y] = n;
  }

  set positionZ(n) {
    this.model.positionMatrix.elements[MATRIX_Z] = n;
  }

  constructor() {
    this.model = {};
  }
}
