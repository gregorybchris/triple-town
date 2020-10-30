import Entity from './entity.js'

const EMPTY = new Entity('empty', '#404040', 0, null)
const STORAGE = new Entity('storage', '#000000', 0, null)

const FORTRESS = new Entity('fortress', '#63149F', null, null)
const MANSION = new Entity('mansion', '#9F1F6C', 5000, FORTRESS)
const HOUSE = new Entity('house', '#9F3851', 1500, MANSION)
const COTTAGE = new Entity('cottage', '#9F3338', 500, HOUSE)
const TREE = new Entity('tree', '#225A03', 100, COTTAGE)
const BUSH = new Entity('bush', '#2D7703', 20, TREE)
const GRASS = new Entity('grass', '#3A9B04', 0, BUSH)

const TREASURE = new Entity('treasure', '#E07C03', 10000, null) // + 500
const CATHEDRAL = new Entity('cathedral', '#737373', 5000, TREASURE)
const CHURCH = new Entity('church', '#969595', 1000, CATHEDRAL)
const TOMBSTONE = new Entity('tombstone', '#B3B1B1', 0, CHURCH)
const BEAR = new Entity('bear', '#D2B74B', 0, TOMBSTONE)

const GEM = new Entity('gem', '#4DC1D3', 0, null)
const ROBOT = new Entity('robot', '#D30601', 0, null)

export {
  EMPTY, STORAGE,
  GRASS, BUSH, TREE, COTTAGE, HOUSE, MANSION, FORTRESS,
  BEAR, TOMBSTONE, CHURCH, CATHEDRAL, TREASURE,
  GEM, ROBOT
}
