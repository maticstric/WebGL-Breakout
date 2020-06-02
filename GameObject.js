// For accessing matrices inside class
const MATRIX_X = 12;
const MATRIX_Y = 13;
const MATRIX_Z = 14;

class GameObject {
  translate(x, y, z) {
    this.model.positionMatrix.translate(x, y, z);
    this.canBounceBall = true;
  }

  translateVect(v) {
    let x = v.elements[0];
    let y = v.elements[1];
    let z = v.elements[2];

    this.model.positionMatrix.translate(x, y, z);
  }

  scale(x, y, z) {
    this.model.scaleMatrix.scale(x, y, z);
  }

  get width() {
    return this.model.scaleMatrix.elements[0] * 2;
  }

  get height() {
    return this.model.scaleMatrix.elements[5] * 2;
  }

  get position() {
    let x = this.model.positionMatrix.elements[MATRIX_X];
    let y = this.model.positionMatrix.elements[MATRIX_Y];
    let z = this.model.positionMatrix.elements[MATRIX_Z];

    return new Vector3([x, y, z]);
  }

  set position(v) {
    let x = this.elements[X];
    let y = this.elements[Y];
    let z = this.elements[Z];

    this.model.positionMatrix.elements[MATRIX_X] = x;
    this.model.positionMatrix.elements[MATRIX_Y] = y;
    this.model.positionMatrix.elements[MATRIX_Z] = z;
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

  // From a list of points/positions (given as Vector3) figures out if 
  // any (and if so which one) are inside the object and returns them
  arePointsInside(points) {
    let pointsInside = [];

    for (let i = 0; i < points.length; i++) {
      let p = points[i];

      let x = p.elements[0];    
      let y = p.elements[1];    
      let z = p.elements[2];    

      if (x > this.positionX - this.width / 2) {
        if (x < this.positionX + this.width / 2) {
          if (y > this.positionY - this.height / 2) {
            if (y < this.positionY + this.height / 2) {
              pointsInside.push(p);
            }
          }
        }
      }
    }

    return pointsInside;
  }

  constructor() {
    this.model = {};
  }
}
