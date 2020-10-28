class Tile {
  constructor(entity, x, y) {
    this.entity = entity;
    this.x = x;
    this.y = y;
    this.bonus = false;
    this.id = `tile_${x}_${y}`
  }
}

export default Tile
