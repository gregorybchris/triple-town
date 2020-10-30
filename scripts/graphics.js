import { computeStarPoints, shadeColor } from "./graphics-utilities.js"
import { ALL_ENTITIES } from "./entities.js"

const CELL_SIZE = 30
const [WIDTH, HEIGHT] = [200, 200]
const [X_PADDING, Y_PADDING] = [25, 25]

const getTileTooltipText = (tile) => `${tile.entity.name}${tile.bonus ? "*" : ""}`

const initializeTileGradients = (canvas) => {
  canvas
    .append("defs")

  ALL_ENTITIES.forEach((entity) => {
    let gradientId = `gradient_${entity.name}`
    let gradient = d3
      .select("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%")

    const colorA = shadeColor(entity.color, 0)
    gradient.append("stop")
      .attr('class', 'start')
      .attr("offset", "0%")
      .attr("stop-color", colorA)
      .attr("stop-opacity", 1)

    const colorB = shadeColor(entity.color, 0)
      gradient.append("stop")
      .attr('class', 'end')
      .attr("offset", "100%")
      .attr("stop-color", colorB)
      .attr("stop-opacity", 1)
  })
}

const initializeGraphics = (grid, onTileClick) => {
  const canvas = d3.select("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)

  initializeTileGradients(canvas)

  const circles = canvas
    .selectAll("circle")
    .data([].concat(...grid.tiles))
    .enter()
    .append("circle")
    .classed("tile-circle", true)
    .attr("cx", (tile) => tile.x * CELL_SIZE + X_PADDING)
    .attr("cy", (tile) => tile.y * CELL_SIZE + Y_PADDING)
    .attr("r", CELL_SIZE / 2)
    .attr("fill", (tile) => `url(#gradient_${tile.entity.name})`)
    .attr("id", (tile) => `circle_${tile.id}`)
    .on("click", (mouseEvent, tile) => onTileClick(tile))
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

const rerenderGraphics = (game) => {
  game.grid.tiles.forEach((row) => {
    row.forEach((tile) => {
      // Update circle colors
      d3.select(`#circle_${tile.id}`).attr("fill", `url(#gradient_${tile.entity.name})`)
      d3.select(`#circle_${tile.id} > title`).text(getTileTooltipText(tile))

      // Update bonus indicators
      d3.select(`#bonus_${tile.id}`).attr("fill", tile.bonus ? "white" : "transparent")
    })
  })

  // Update page text
  d3.select("#score").text(`Score: ${game.score}`)
  d3.select("#active").text(`Placing: ${game.activeEntity.name}`)
}

export { initializeGraphics, rerenderGraphics }
