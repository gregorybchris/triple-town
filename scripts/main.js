import { Game } from "./game.js"
import { Grid } from "./grid.js"
import { initializeGraphics, rerenderGraphics } from "./graphics.js"

const grid = new Grid()
const game = new Game(grid)

const onClick = (tile) => {
  game.onTileClick(tile)
  rerenderGraphics(game)
}

initializeGraphics(grid, onClick)
