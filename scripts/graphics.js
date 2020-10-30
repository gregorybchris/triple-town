import { computeStarPoints, shadeColor } from "./graphics-utilities.js"
import { ALL_ENTITIES } from "./entities.js"

const CELL_WIDTH = 30
const CELL_HEIGHT = 30
const [WIDTH, HEIGHT] = [200, 200]
const [X_PADDING, Y_PADDING] = [10, 10]

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

  const tileMarkers = canvas
    .selectAll("rect")
    .data([].concat(...grid.tiles))
    .enter()
    .append("rect")
    .classed("tile-marker", true)
    .attr("x", (tile) => tile.x * CELL_WIDTH + X_PADDING)
    .attr("y", (tile) => tile.y * CELL_HEIGHT + Y_PADDING)
    .attr("width", CELL_WIDTH)
    .attr("height", CELL_HEIGHT)
    .attr("stroke-width", 2.3)
    .attr("stroke", "rgb(40, 40, 40)")
    .attr("fill", (tile) => `url(#gradient_${tile.entity.name})`)
    .attr("id", (tile) => `tile_marker_${tile.id}`)
    .on("click", (mouseEvent, tile) => onTileClick(tile))
  tileMarkers.append("title").text((tile) => getTileTooltipText(tile))

  canvas
    .selectAll("polygon")
    .data([].concat(...grid.tiles))
    .enter()
    .append("polygon")
    .classed("tile-bonus", true)
    .attr("points", (tile) => {
      const x = tile.x * CELL_WIDTH + X_PADDING + 23
      const y = tile.y * CELL_HEIGHT + Y_PADDING + 7
      const points = computeStarPoints(5, 3, 0.8, x, y)
      return [].concat(...points).join(" ")
    })
    .attr("fill", "transparent")
    .attr("id", (tile) => `bonus_${tile.id}`)
}

const rerenderGraphics = (game) => {
  game.grid.tiles.forEach((row) => {
    row.forEach((tile) => {
      // Update tile marker colors
      d3.select(`#tile_marker_${tile.id}`).attr("fill", `url(#gradient_${tile.entity.name})`)
      d3.select(`#tile_marker_${tile.id} > title`).text(getTileTooltipText(tile))

      // Update bonus indicators
      d3.select(`#bonus_${tile.id}`).attr("fill", tile.bonus ? "rgb(230, 230, 230)" : "transparent")
    })
  })

  // Update page text
  d3.select("#score").text(`Score: ${game.score}`)
  d3.select("#active").text(`Placing: ${game.activeEntity.name}`)
  d3.select("#turns").text(`Turns: ${game.turns}`)
}

export { initializeGraphics, rerenderGraphics }
