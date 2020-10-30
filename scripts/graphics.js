import { computeStarPoints } from "./graphics-utilities.js"

const CELL_SIZE = 30
const [WIDTH, HEIGHT] = [200, 200]
const [X_PADDING, Y_PADDING] = [25, 25]

const getTileTooltipText = (tile) => `${tile.entity.name}${tile.bonus ? "+" : ""}`

const initializeGraphics = (grid, game) => {
  const canvas = d3.select("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)

  const circles = canvas
    .selectAll("circle")
    .data([].concat(...grid.tiles))
    .enter()
    .append("circle")
    .classed("tile-circle", true)
    .attr("cx", (tile) => tile.x * CELL_SIZE + X_PADDING)
    .attr("cy", (tile) => tile.y * CELL_SIZE + Y_PADDING)
    .attr("r", CELL_SIZE / 2)
    .attr("fill", (tile) => tile.entity.color)
    .attr("id", (tile) => `circle_${tile.id}`)
    .on("click", (mouseEvent, tile) => game.onTileClick(tile, rerenderGraphics))
  circles.append("title").text((tile) => getTileTooltipText(tile))

  canvas
    .selectAll("polygon")
    .data([].concat(...grid.tiles))
    .enter()
    .append("polygon")
    .classed("tile-bonus", true)
    .attr("points", (tile) => {
      const x = tile.x * CELL_SIZE + X_PADDING + 7
      const y = tile.y * CELL_SIZE + Y_PADDING - 7
      const points = computeStarPoints(5, 3, 0.8, x, y)
      return [].concat(...points).join(" ")
    })
    .attr("fill", "transparent")
    .attr("id", (tile) => `bonus_${tile.id}`)
}

const rerenderGraphics = (grid) => {
  grid.tiles.forEach((row) => {
    row.forEach((tile) => {
      d3.select(`#circle_${tile.id}`).attr("fill", tile.entity.color)
      d3.select(`#circle_${tile.id} > title`).text(getTileTooltipText(tile))
      d3.select(`#bonus_${tile.id}`).attr("fill", tile.bonus ? "white" : "transparent")
    })
  })
}

export { initializeGraphics }
