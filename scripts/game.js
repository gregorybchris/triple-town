import {
  EMPTY,
  GRASS, BUSH, TREE,
  TOMBSTONE,
} from "./entities.js"

class Game {
  static ENTITY_PROBABILITIES = [
    [GRASS, 0.84],
    [BUSH, 0.10],
    [TOMBSTONE, 0.05],
    [TREE, 0.01],
  ]

  constructor(grid) {
    this._grid = grid
    this._score = 0
    this._turns = 0
    this._activeEntity = GRASS
  }

  get grid() {
    return this._grid
  }

  get score() {
    return this._score
  }

  get turns() {
    return this._turns
  }

  get activeEntity() {
    return this._activeEntity
  }

  onTileClick(tile) {
    if (tile.entity.name == EMPTY.name) {
      this.updateClickedTile(tile, this._grid)
      this._turns++
      this._activeEntity = this.getRandomEntity()
    }
    else {
      console.log("SCREAM")
    }
  }

  updateClickedTile(targetTile, grid) {
    const floodTiles = Game.floodGet(grid, targetTile, this._activeEntity)
    if (floodTiles.length < 2) {
      targetTile.entity = this._activeEntity
    }
    else {
      floodTiles.forEach((floodTile) => {
        floodTile.entity = EMPTY
        floodTile.bonus = false
      })
      targetTile.bonus = false

      if (floodTiles.length > 2) {
        targetTile.bonus = true
        this._score += this._activeEntity.next.value * 2
      }
      else {
        this._score += this._activeEntity.next.value
      }

      this._activeEntity = this._activeEntity.next
      this.updateClickedTile(targetTile, grid)
    }
  }

  static getChildren = (tile, grid) => {
    const [x, y] = [tile.x, tile.y]
    const children = []
    if (x > 0) { children.push(grid.tiles[x - 1][y]) }
    if (y > 0) { children.push(grid.tiles[x][y - 1]) }
    if (x < grid.width - 1) { children.push(grid.tiles[x + 1][y]) }
    if (y < grid.height - 1) { children.push(grid.tiles[x][y + 1]) }
    return children
  }
  
  static floodGet = (grid, targetTile, activeEntity, results, resultsIds) => {
    if (!resultsIds) { resultsIds = new Set(targetTile.id) }
    if (!results) { results = [] }
    Game.getChildren(targetTile, grid).forEach((child) => {
      if (child.entity.name == activeEntity.name) {
        if (!resultsIds.has(child.id)) {
          results.push(child)
          resultsIds.add(child.id)
          Game.floodGet(grid, child, activeEntity, results, resultsIds)
        }
      }
    })
    return results
  }

  getRandomEntity() {
    const sample = Math.random()
    let aggregate = 0
    for (let i = 0; i < Game.ENTITY_PROBABILITIES.length; i++) {
      let [entity, probability] = Game.ENTITY_PROBABILITIES[i]
      aggregate += probability
      if (sample < aggregate) {
        return entity
      }
    }
    return GRASS
  }
}

export default Game
