import {
  EMPTY,
  STORAGE,
} from "./entities.js"

import Tile from "./tile.js"

const GRID_WIDTH = 6
const GRID_HEIGHT = 6

class Grid {
  constructor(width = GRID_WIDTH, height = GRID_HEIGHT) {
    this._width = width
    this._height = height

    this._tiles = [...Array(width).keys()].map((xi) => {
      return [...Array(height).keys()].map((yi) => {
        return new Tile(EMPTY, xi, yi)
      })
    })
    this._tiles[0][0] = new Tile(STORAGE, 0, 0)
  }

  get width() {
    return this._width
  }

  get height() {
    return this._width
  }

  get tiles() {
    return this._tiles
  }
}

export default Grid
