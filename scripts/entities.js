class Entity {
  constructor(name, color, next) {
    this.name = name;
    this.color = color;
    this.next = next;
  }
}

const EMPTY = new Entity('empty', '#404040', null)
const STORAGE = new Entity('storage', '#000000', null)

const FORTRESS = new Entity('fortress', '#63149F', null)
const MANSION = new Entity('mansion', '#9F1F6C', FORTRESS)
const HOUSE = new Entity('house', '#9F3851', MANSION)
const COTTAGE = new Entity('cottage', '#9F3338', HOUSE)
const TREE = new Entity('tree', '#225A03', COTTAGE)
const BUSH = new Entity('bush', '#2D7703', TREE)
const GRASS = new Entity('grass', '#3A9B04', BUSH)

const TREASURE = new Entity('treasure', '#E07C03', null)
const CATHEDRAL = new Entity('cathedral', '#737373', TREASURE)
const CHURCH = new Entity('church', '#969595', CATHEDRAL)
const TOMBSTONE = new Entity('tombstone', '#B3B1B1', CHURCH)
const BEAR = new Entity('bear', '#D2B74B', TOMBSTONE)

const GEM = new Entity('gem', '#4DC1D3', null)
const ROBOT = new Entity('robot', '#D30601', null)

export {
  EMPTY, STORAGE,
  GRASS, BUSH, TREE, COTTAGE, HOUSE, MANSION, FORTRESS,
  BEAR, TOMBSTONE, CHURCH, CATHEDRAL, TREASURE,
  GEM, ROBOT
}
