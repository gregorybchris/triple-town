import {
  EMPTY,
  GRASS,
  ENTITY_PROBABILITIES
} from "./entities.js"

class Game {
  constructor(grid) {
    this._grid = grid
    this._gameScore = 0
    this._placingEntity = GRASS
  }

  updateGameScore(points) {
    this._gameScore += points
    d3.select("#score").text(`Score: ${this._gameScore}`)
  }

  updateGameInfo(info) {
    d3.select("#info").text(info)
  }

  onTileClick(tile, rerender) {
    if (tile.entity.name == EMPTY.name) {
      this.updateClickedTile(tile, this._grid, this._placingEntity)
  
      this._placingEntity = this.getRandomEntity()
      this.updateGameInfo(`Placing: ${this._placingEntity.name}`)
      rerender(this._grid)
    }
    else {
      console.log("SCREAM")
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
  
  static floodGet = (grid, targetTile, placingEntity, results, resultsIds) => {
    if (!resultsIds) { resultsIds = new Set(targetTile.id) }
    if (!results) { results = [] }
    Game.getChildren(targetTile, grid).forEach((child) => {
      if (child.entity.name == placingEntity.name) {
        if (!resultsIds.has(child.id)) {
          results.push(child)
          resultsIds.add(child.id)
          Game.floodGet(grid, child, placingEntity, results, resultsIds)
        }
      }
    })
    return results
  }

  updateClickedTile(targetTile, grid, placingEntity) {
    const floodTiles = Game.floodGet(grid, targetTile, placingEntity)
    if (floodTiles.length < 2) {
      targetTile.entity = placingEntity
    }
    else {
      floodTiles.forEach((floodTile) => {
        floodTile.entity = EMPTY
        floodTile.bonus = false
      })
      targetTile.bonus = false
  
      if (floodTiles.length > 2) {
        targetTile.bonus = true
        this.updateGameScore(placingEntity.next.value * 2)
      }
      else {
        this.updateGameScore(placingEntity.next.value)
      }
  
      placingEntity = placingEntity.next
      this.updateClickedTile(targetTile, grid, placingEntity)
    }
  }

  getRandomEntity() {
    const sample = Math.random()
    let aggregate = 0
    for (let i = 0; i < ENTITY_PROBABILITIES.length; i++) {
      let [entity, probability] = ENTITY_PROBABILITIES[i]
      aggregate += probability
      if (sample < aggregate) {
        return entity
      }
    }
    return GRASS
  }
}

export { Game }