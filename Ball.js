class Ball extends GameObject {
  // Division of the collider as an angle
  static get colliderSubdivision () {return 10;}

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
    let pointInsideIndex = null;

    for (let i = 0; i < g_tiles.length; i++) {
      let t = g_tiles[i];

      pointInsideIndex = t.arePointsInside(this.collisionPoints); // Check if any points are inside

      if (pointInsideIndex !== null) { // Collision happened
        this.bounce(pointInsideIndex);

        g_tiles.splice(i, 1);
      }
    }
  }

  checkPaddleWallCollisions() {
    let pointInsideIndex = null;
    let paddleAndWalls = [];

    paddleAndWalls = paddleAndWalls.concat(g_walls);
    paddleAndWalls = paddleAndWalls.concat(g_paddle);

    for (let i = 0; i < paddleAndWalls.length; i++) {
      let t = paddleAndWalls[i];

      pointInsideIndex = t.arePointsInside(this.collisionPoints); // Check if any points are inside

      if (pointInsideIndex !== null) { // Collision happened
        this.bounce(pointInsideIndex);
      }
    }
  }

  bounce(pointInsideIndex) {
    let velocityMagnitude = this.velocity.magnitude();
    let bounce = this.position;
    bounce.sub(pointInsideIndex);
    bounce.normalize();
    bounce.mul(velocityMagnitude);

    this.velocity.add(bounce);
    this.velocity.normalize();
    this.velocity.mul(velocityMagnitude);
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
