import {
  EMPTY, GRASS, GEM, ROBOT, ROCK,
} from "./entities.js"

import ENTITY_PROBABILITIES from './entity-probabilities.js'

class Game {
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
    const updateSuccess = this.updateClickedTile(tile, this._grid)
    if (updateSuccess) {
      this._turns++
      this._activeEntity = this.sampleEntity()
    }
  }

  static getBestFlood(floods) {
    if (floods.length == 0) {
      throw 'No tiles to search';
    }
    let bestValue = 0
    let bestFlood = null
    for (let i = 0; i < floods.length; i++) {
      if (floods[i][0].entity.value >= bestValue) {
        bestValue = floods[i][0].entity.value
        bestFlood = floods[i]
      }
    }
    return bestFlood
  }

  updateClickedTile(tile, grid) {
    if (this._activeEntity.name == ROBOT.name) {
      if (tile.entity.name == EMPTY.name) {
        tile.entity = ROCK
      }
      else {
        tile.entity = EMPTY
        tile.bonus = false
      }
    }
    else if (tile.entity.name != EMPTY.name) {
      console.log("SCREAM")
      return false
    }
    else {
      if (this._activeEntity.name == GEM.name) {
        const children = Game.getChildren(tile, grid).filter((tile) => tile.entity.name != EMPTY.name)
        if (children.length == 0) {
          tile.entity = ROCK
          return true
        }
        else {
          const childFloods = children.map((child) => Game.floodGet(grid, tile, child.entity))
          const validChildFloods = childFloods.filter((flood) => flood.length >= 2)
          if (validChildFloods.length == 0) {
            tile.entity = ROCK
            return true
          }
          else {
            const bestFlood = Game.getBestFlood(validChildFloods)
            if (bestFlood[0].entity.next == null) {
              tile.entity = ROCK
              return true
            }
            else {
              this._activeEntity = bestFlood[0].entity
            }
          }
        }
      }

      const floodTiles = Game.floodGet(grid, tile, this._activeEntity)
      if (floodTiles.length < 2) {
        tile.entity = this._activeEntity
      }
      else {
        floodTiles.forEach((floodTile) => {
          floodTile.entity = EMPTY
          floodTile.bonus = false
        })
        tile.bonus = false

        if (floodTiles.length > 2) {
          tile.bonus = true
          this._score += this._activeEntity.next.value * 2
        }
        else {
          this._score += this._activeEntity.next.value
        }

        this._activeEntity = this._activeEntity.next
        this.updateClickedTile(tile, grid)
      }
    }
    return true
  }

  static getChildren(tile, grid) {
    const [x, y] = [tile.x, tile.y]
    const children = []
    if (x > 0) { children.push(grid.tiles[x - 1][y]) }
    if (y > 0) { children.push(grid.tiles[x][y - 1]) }
    if (x < grid.width - 1) { children.push(grid.tiles[x + 1][y]) }
    if (y < grid.height - 1) { children.push(grid.tiles[x][y + 1]) }
    return children
  }

  static floodGet(grid, targetTile, targetEntity, results, resultsIds) {
    if (!resultsIds) { resultsIds = new Set(targetTile.id) }
    if (!results) { results = [] }
    Game.getChildren(targetTile, grid).forEach((child) => {
      if (child.entity.name == targetEntity.name) {
        if (!resultsIds.has(child.id)) {
          results.push(child)
          resultsIds.add(child.id)
          Game.floodGet(grid, child, targetEntity, results, resultsIds)
        }
      }
    })
    return results
  }

  sampleEntity() {
    const sampleValue = Math.random()
    let aggregateProbability = 0
    for (let i = 0; i < ENTITY_PROBABILITIES.length; i++) {
      let [entity, entityProbability] = ENTITY_PROBABILITIES[i]
      aggregateProbability += entityProbability
      if (sampleValue < aggregateProbability) {
        return entity
      }
    }
    return GRASS
  }
}

export default Game
