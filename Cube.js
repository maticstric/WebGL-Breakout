class Cube extends Model{
  constructor(color) {
    super();
    this.vertices = this.initVertices(color);
  }

  initVertices(color) {
    var vertices = [
    // Front of the cube
    -1,-1, 1, 0,0, color[0],color[1],color[2],color[3], 0,0,1,
    -1, 1, 1, 0,1, color[0],color[1],color[2],color[3], 0,0,1,
     1, 1, 1, 1,1, color[0],color[1],color[2],color[3], 0,0,1,
    -1,-1, 1, 0,0, color[0],color[1],color[2],color[3], 0,0,1,
     1, 1, 1, 1,1, color[0],color[1],color[2],color[3], 0,0,1,
     1,-1, 1, 1,0, color[0],color[1],color[2],color[3], 0,0,1,

    // Top of the cube
    -1, 1,-1, 0,0, color[0],color[1],color[2],color[3], 0,1,0,
    -1, 1, 1, 0,1, color[0],color[1],color[2],color[3], 0,1,0,
     1, 1, 1, 1,1, color[0],color[1],color[2],color[3], 0,1,0,
    -1, 1,-1, 0,0, color[0],color[1],color[2],color[3], 0,1,0,
     1, 1, 1, 1,1, color[0],color[1],color[2],color[3], 0,1,0,
     1, 1,-1, 1,0, color[0],color[1],color[2],color[3], 0,1,0,

    // Right of the cube 
     1,-1,-1, 0,0, color[0],color[1],color[2],color[3], 1,0,0,
     1, 1,-1, 0,1, color[0],color[1],color[2],color[3], 1,0,0,
     1, 1, 1, 1,1, color[0],color[1],color[2],color[3], 1,0,0,
     1,-1,-1, 0,0, color[0],color[1],color[2],color[3], 1,0,0,
     1, 1, 1, 1,1, color[0],color[1],color[2],color[3], 1,0,0,
     1,-1, 1, 1,0, color[0],color[1],color[2],color[3], 1,0,0,

    // Left of the cube
    -1,-1,-1, 0,0, color[0],color[1],color[2],color[3], -1,0,0, 
    -1, 1,-1, 0,1, color[0],color[1],color[2],color[3], -1,0,0,
    -1, 1, 1, 1,1, color[0],color[1],color[2],color[3], -1,0,0, 
    -1,-1,-1, 0,0, color[0],color[1],color[2],color[3], -1,0,0, 
    -1, 1, 1, 1,1, color[0],color[1],color[2],color[3], -1,0,0, 
    -1,-1, 1, 1,0, color[0],color[1],color[2],color[3], -1,0,0, 

    // Bottom of the cube 
    -1,-1,-1, 0,0, color[0],color[1],color[2],color[3], 0,-1,0,
    -1,-1, 1, 0,1, color[0],color[1],color[2],color[3], 0,-1,0,
     1,-1, 1, 1,1, color[0],color[1],color[2],color[3], 0,-1,0, 
    -1,-1,-1, 0,0, color[0],color[1],color[2],color[3], 0,-1,0,
     1,-1, 1, 1,1, color[0],color[1],color[2],color[3], 0,-1,0,
     1,-1,-1, 1,0, color[0],color[1],color[2],color[3], 0,-1,0,

    // Back of the cube
    -1,-1,-1, 0,0, color[0],color[1],color[2],color[3], 0,0,-1,
    -1, 1,-1, 0,1, color[0],color[1],color[2],color[3], 0,0,-1,
     1, 1,-1, 1,1, color[0],color[1],color[2],color[3], 0,0,-1, 
    -1,-1,-1, 0,0, color[0],color[1],color[2],color[3], 0,0,-1,
     1, 1,-1, 1,1, color[0],color[1],color[2],color[3], 0,0,-1, 
     1,-1,-1, 1,0, color[0],color[1],color[2],color[3], 0,0,-1
    ];

    return new Float32Array(vertices);
  }
}
