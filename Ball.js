class Ball extends GameObject {
  // Division of the collider as an angle
  static get COLLIDER_DIV () {return 16;}
  static get MIN_SPEED () {return 0.1;}
  static get MAX_SPEED () {return 0.30;}
  static get MIN_SPEED_X () {return 0.015;}
  static get MIN_SPEED_Y () {return 0.015;}
  get velocityY () {return this.velocity.elements[1];}
  set velocityY (n) {this.velocity.elements[1] = n;}

  constructor() {
    super();
    this.color = [0.99, 0.89, 0.59, 1];
    this.model = new Sphere(this.color);
    this.model.hasLighting = 0;
    this.velocity = new Vector3([0, 0, 0]);
    this.canBouncePaddle = true;

    this.scale(0.35, 0.35, 0.35);
  }

  move() {
    if (g_gameStarted) {
      // Update position based on velocity if the game has started
      this.translateVect(this.velocity);

      this.checkCollisions();

      if (this.positionY < g_paddle.positionY + g_paddle.height / 2) {
        endGame();
      }
    } else {
      // Otherwise constrain it to the paddle
      this.positionX = g_paddle.positionX;
      this.positionY = g_paddle.positionY + g_paddle.height / 2 + this.width / 2;
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
        if (object instanceof Paddle && this.canBouncePaddle) {
          this.paddleBounce();
          this.canBouncePaddle = false;
          g_paddle_bounce_audio.play();
        } else if (!(object instanceof Paddle)){
          this.bounce(pointsInside);
          this.canBouncePaddle = true;
          
          // Stop audio if already playing
          g_wall_bounce_audio.pause();
          g_wall_bounce_audio.currentTime = 0;

          g_wall_bounce_audio.play();
        }

        if (object instanceof Tile) {
          // Stop audio if already playing
          g_tile_bounce_audio_1.pause();
          g_tile_bounce_audio_1.currentTime = 0;

          g_tile_bounce_audio_1.play();

          g_tiles.splice(i, 1);
          objects.splice(i, 1);

          checkHasWon();

          let newSpeed = Ball.MAX_SPEED - (Ball.MAX_SPEED - Ball.MIN_SPEED) * (g_tiles.length / g_tilesOriginalLength);

          this.velocity.normalize();
          this.velocity.mul(newSpeed);
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

    // Check if velocity is in the same direction as the collision points
    if (Vector3.dot(n, this.velocity) > 0){
      // Invert it to serve as the reflection axis
      n.mul(-1);

      // Set the incident vector
      let d = new Vector3([0, 0, 0]);
      d.set(this.velocity);

      n.mul(Vector3.dot(d, n) * -2); // -2 * dot(d, n) * n

      d.add(n); // d - 2 * dot(d, n) * n

      this.velocity.set(d);

      // Clamp horizontal velocity
      if (Math.abs(this.velocityX) < Ball.MIN_SPEED_X) {
        this.velocityX = Math.sign(this.velocityX) * Ball.MIN_SPEED_X;
      }

      // Clamp vertical velocity
      if (Math.abs(this.velocityY) < Ball.MIN_SPEED_Y) {
        this.velocityY = Math.sign(this.velocityY) * Ball.MIN_SPEED_Y;
      }
    }
  }

  get collisionPoints() {
    let radius = this.width / 2; 
    let increment = 360 / Ball.COLLIDER_DIV;

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
