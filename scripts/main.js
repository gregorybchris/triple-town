import { Game } from "./game.js"
import { Grid } from "./grid.js"
import { initializeGraphics } from "./graphics.js"

const grid = new Grid()
const game = new Game(grid)

initializeGraphics(grid, game)
