import {
  EMPTY, STORAGE,
  GRASS, BUSH, TREE
} from "./entities.js"
import Tile from "./tile.js"

const GRID_SIZE = 6
const CELL_SIZE = 30

const createGrid = () => {
  const gridRange = [...Array(GRID_SIZE).keys()]
  const tileGrid = gridRange.map((xi) => gridRange.map((yi) => new Tile(EMPTY, xi, yi)))
  tileGrid[0][0] = new Tile(STORAGE, 0, 0)
  return tileGrid
}

const updateGameInfo = (info) => {
  d3.select("#info").text(info)
}

const tileGrid = createGrid()

let nextEntity = GRASS
updateGameInfo(`Placing: ${nextEntity.name}`)

const getChildren = (tile) => {
  const [x, y] = [tile.x, tile.y]
  const children = []
  if (x > 0) { children.push(tileGrid[x - 1][y]) }
  if (y > 0) { children.push(tileGrid[x][y - 1]) }
  if (x < GRID_SIZE - 1) { children.push(tileGrid[x + 1][y]) }
  if (y < GRID_SIZE - 1) { children.push(tileGrid[x][y + 1]) }
  return children
}

const floodGet = (targetTile, nextEntity, results, resultsIds) => {
  if (!resultsIds) { resultsIds = new Set(targetTile.id) }
  if (!results) { results = [] }
  getChildren(targetTile).forEach((child) => {
    if (child.entity.name == nextEntity.name) {
      if (!resultsIds.has(child.id)) {
        results.push(child)
        resultsIds.add(child.id)
        floodGet(child, nextEntity, results, resultsIds)
      }
    }
  })
  return results
}

const updateClickedTile = (targetTile) => {
  const floodTiles = floodGet(targetTile, nextEntity)
    if (floodTiles.length < 2) {
      targetTile.entity = nextEntity
    }
    else {
      floodTiles.forEach((floodTile) => {
        floodTile.entity = EMPTY
        floodTile.bonus = false
      })
      if (floodTiles.length > 2) {
        targetTile.bonus = true
      }
      nextEntity = nextEntity.next
      updateClickedTile(targetTile)
    }
}

const onTileClick = (tile) => {
  if (tile.entity.name == EMPTY.name) {
    updateClickedTile(tile)

    nextEntity = getRandomEntity()
    updateGameInfo(`Placing: ${nextEntity.name}`)
    rerenderGame(tileGrid)
  }
  else {
    console.log("SCREAM")
  }
}

const getRandomEntity = () => {
  const probabilities = [
    [GRASS, 0.84],
    [BUSH, 0.15],
    [TREE, 0.01],
  ]
  const sample = Math.random()
  let aggregate = 0
  for (let i = 0; i < probabilities.length; i++) {
    let [entity, probability] = probabilities[i]
    aggregate += probability
    if (sample < aggregate) {
      return entity
    }
  }
  return GRASS
}

const getTileTooltip = (tile) => `${tile.entity.name}${tile.bonus ? "+" : ""}`

const initializeGame = (tileGrid) => {
  const [width, height] = [200, 200]
  const canvas = d3.select("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)

  const [xPadding, yPadding] = [25, 25]
  const circles = canvas
    .selectAll("circle")
    .data([].concat(...tileGrid))
    .enter()
    .append("circle")
    .classed("tile-circle", true)
    .attr("cx", (tile) => tile.x * CELL_SIZE + xPadding)
    .attr("cy", (tile) => tile.y * CELL_SIZE + yPadding)
    .attr("r", CELL_SIZE / 2)
    .attr("fill", (tile) => tile.entity.color)
    .attr("id", (tile) => tile.id)
    .on("click", (mouseEvent, tile) => onTileClick(tile))
  circles.append("title").text((tile) => getTileTooltip(tile))
}

const rerenderGame = (tileGrid) => {
  tileGrid.forEach((row) => {
    row.forEach((tile) => {
      d3.select(`#${tile.id}`).attr("fill", tile.entity.color)
      d3.select(`#${tile.id} > title`).text(getTileTooltip(tile))
    })
  })
}

initializeGame(tileGrid)
