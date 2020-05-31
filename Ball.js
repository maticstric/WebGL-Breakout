class Ball extends GameObject {
  // Division of the collider as an angle
  static get colliderSubdivision () {return 16;}

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

    this.translate(0, -8.75, 0); // Inital position
    this.scale(0.35, 0.35, 0.35);
  }

  move() {
    if (g_gameStarted) {
      // Update position based on velocity if the game has started
      this.translateVect(this.velocity);

      this.checkTileCollisions();
      this.checkPaddleWallCollisions();
    } else {
      // Otherwise constrain it to the paddle
      this.positionX =  g_paddle.positionX;
    }
  }

  checkTileCollisions() {
    let pointsInside = null;

    for (let i = 0; i < g_tiles.length; i++) {
      let t = g_tiles[i];

      pointsInside = t.arePointsInside(this.collisionPoints); // Check if any points are inside

      if (pointsInside.length > 0) { // Collision happened
        this.bounce(pointsInside);

        g_tiles.splice(i, 1);
      }
    }
  }

  checkPaddleWallCollisions() {
    let pointsInside = null;
    let paddleAndWalls = [];

    paddleAndWalls = paddleAndWalls.concat(g_walls);
    paddleAndWalls = paddleAndWalls.concat(g_paddle);

    for (let i = 0; i < paddleAndWalls.length; i++) {
      let t = paddleAndWalls[i];

      pointsInside = t.arePointsInside(this.collisionPoints); // Check if any points are inside

      if (pointsInside.length > 0) { // Collision happened
        this.bounce(pointsInside);
      }
    }
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
