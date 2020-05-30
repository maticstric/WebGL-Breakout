class Ball extends GameObject {
  get velocityX() {return this.velocity.elements[0];}
  get velocityY() {return this.velocity.elements[1];}
  get velocityZ() {return this.velocity.elements[2];}

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
      this.translate(this.velocityX, this.velocityY, this.velocityZ);

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
    if (pointInsideIndex === 0 || pointInsideIndex === 2) { // North or south
      this.velocity.elements[1] *= -1;
    }

    if (pointInsideIndex === 1 || pointInsideIndex === 3) { // East or west
      this.velocity.elements[0] *= -1;
    }
  }

  get collisionPoints() {
    let radius = this.width / 2; 
    let position = this.position; 

    let points = [];

    // Points defined clockwise starting at north
    points.push(new Vector3([position.elements[0], position.elements[1] + radius, position.elements[2]]));  
    points.push(new Vector3([position.elements[0] + radius, position.elements[1], position.elements[2]]));  
    points.push(new Vector3([position.elements[0], position.elements[1] - radius, position.elements[2]]));  
    points.push(new Vector3([position.elements[0] - radius, position.elements[1], position.elements[2]]));  

    return points;
  }
}
