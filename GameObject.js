const VECTOR_X = 0;
const VECTOR_Y = 1;
const VECTOR_Z = 2;

const MATRIX_X = 12;
const MATIRX_Y = 13;
const MATIRX_Z = 14;

// Temporary
const X = 12;
const Y = 13;
const Z = 14;

class GameObject {
  get position() {
    let x = this.model.positionMatrix.elements[MATRIX_X];
    let y = this.model.positionMatrix.elements[MATIRX_Y];
    let z = this.model.positionMatrix.elements[MATIRX_Z];

    return new Vector3([x, y, z]);
  }

  set position(v) {
    let x = this.elements[VECTOR_X];
    let y = this.elements[VECTOR_Y];
    let z = this.elements[VECTOR_Z];

    this.model.positionMatrix.elements[MATRIX_X] = x;
    this.model.positionMatrix.elements[MATIRX_Y] = y;
    this.model.positionMatrix.elements[MATIRX_Z] = z;
  }

  constructor() {
    this.model = {};
  }
}
