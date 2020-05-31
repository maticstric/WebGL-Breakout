class Ball extends GameObject {
  // Division of the collider as an angle
  static get colliderSubdivision () {return 48;}

  get velocityX() {return this.velocity.elements[0];}
  get velocityY() {return this.velocity.elements[1];}
  get velocityZ() {return this.velocity.elements[2];}

  set velocityX(n) {this.velocity.elements[0] = n;}
  set velocityY(n) {this.velocity.elements[1] = n;}
  set velocityZ(n) {this.velocity.elements[2] = n;}

  constructor() {
    super();
    this.model = new Sphere();
    this.velocity = new Vector3([0, 0, 0]);
    this.canHitPaddle = true;

    this.translate(0, -8.75, 0); // Inital position
    this.scale(0.35, 0.35, 0.35);
  }

  move() {
    if (g_gameStarted) {
      // Update position based on velocity if the game has started
      this.translateVect(this.velocity);

      this.checkCollisions();
    } else {
      // Otherwise constrain it to the paddle
      this.positionX =  g_paddle.positionX;
    }
  }

  checkCollisions() {
    let pointsInside = null;
    let objects = [];

    objects = objects.concat(g_tiles);
    objects = objects.concat(g_walls);
    objects = objects.concat(g_paddle);

    for (let i = 0; i < objects.length; i++) {
      let object = objects[i];

      // Check if any points are inside
      pointsInside = object.arePointsInside(this.collisionPoints); 

      if (pointsInside.length > 0) { // Collision happened
        if (object instanceof Paddle && this.canHitPaddle){
          this.paddleBounce();
          this.canHitPaddle = false;
        } else if (!(object instanceof Paddle)) {
          this.bounce(pointsInside);
          this.canHitPaddle = true;
        }

        if (object instanceof Tile) {
          g_tiles.splice(i, 1);
        }
      }
    }
  }

  paddleBounce() {
    // Percentage away from center
    let collisionPoint = (this.positionX - g_paddle.positionX) / (g_paddle.width / 2);

    // Makes 45 deg the largest angle (assuming no bounces from edges of paddle)
    let angle = collisionPoint * Math.PI / 4; 

    this.velocity = new Vector3([Math.sin(angle), Math.cos(angle), 0]).mul(this.velocity.magnitude()); 
  }

  bounce(pointsInside) {
    // reflection formula r = d - 2 * dot(d, n) * n
    // r is the reflection of d accross n, n must be normalized

    let n = new Vector3([0, 0, 0]);
    // Find the normal vector in between the all the pointsInside and 
    for (let point of pointsInside){
      point.sub(this.position);
      point.normalize();
      n.add(point);
    }
    n.normalize();
    // Invert it to serve as the reflection axis
    n.mul(-1);

    // Set the incident vector
    let d = new Vector3([0, 0, 0]);
    d.set(this.velocity);

    n.mul(Vector3.dot(d, n) * -2); // -2 * dot(d, n) * n

    d.add(n); // d - 2 * dot(d, n) * n

    this.velocity.set(d);
  }

  get collisionPoints() {
    let radius = this.width / 2; 
    let increment = 360 / Ball.colliderSubdivision;

    let points = [];

    // Points defined counterclockwise starting at east
    for (let deg = 0; deg < 360; deg += increment){
      let rad = deg * Math.PI / 180;

      points.push(new Vector3([this.positionX + Math.cos(rad) * radius,
                               this.positionY + Math.sin(rad) * radius, 0]));  
    }

    return points;
  }
}
