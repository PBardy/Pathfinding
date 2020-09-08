import Grid from './Grid.js'
import Colors from './Colors.js'
import Search from './Search.js'

const app = document.querySelector('.app')

let gridWidth = 10
let gridHeight = 10
let grid = new Grid(app, gridWidth, gridHeight).build()

/**
 * Updates grid width when changed from control panel
 */

document.getElementById('grid-width')
  .addEventListener('change', (event) => {
    const min = Number.parseInt(event.target.getAttribute('min'))
    const max = Number.parseInt(event.target.getAttribute('max'))
    const val = Number.parseInt(event.target.value)
    if(val < min || val > max) return
    if(gridWidth == null || gridHeight == null) return
    gridWidth = val
    grid = new Grid(app, gridWidth, gridHeight).build()
  })


/**
 * Updates grid height when changed from control panel
 */

document.getElementById('grid-height')
  .addEventListener('change', (event) => {
    const min = Number.parseInt(event.target.getAttribute('min'))
    const max = Number.parseInt(event.target.getAttribute('max'))
    const val = Number.parseInt(event.target.value)
    if(val < min || val > max) return
    if(gridWidth == null || gridHeight == null) return
    gridHeight = val
    grid = new Grid(app, gridWidth, gridHeight).build()
  })


/**
 * Generates a grid of random width and height
 */

document.getElementById('randomize')
  .addEventListener('click', (event) => {
    const widthInput = document.getElementById('grid-width')
    const heightInput = document.getElementById('grid-height')
    const min = Number.parseInt(widthInput.getAttribute('min'))
    const max = Number.parseInt(heightInput.getAttribute('max'))
    gridWidth = Math.floor(Math.random() * (max - min)) + min
    gridHeight = Math.floor(Math.random() * (max - min)) + min
    widthInput.value = gridWidth
    heightInput.value = gridHeight
    grid = new Grid(app, gridWidth, gridHeight).build()
  })


/**
 * Clears all walls, making everywhere traversable
 */

document.getElementById('clear-walls')
  .addEventListener('click', (event) => {
    if(grid == null) return
    grid.clearWalls()
  })


/**
 * Clear all search data from grid.
 * Keep the walls and source/target nodes
 */

document.getElementById('clear-search')
  .addEventListener('click', (event) => {
    if(grid == null) return
    grid.clearSearch()
  })


/**
 * Clear everything, search data and walls.
 * Keeps source/target nodes.
 */

document.getElementById('clear-all')
  .addEventListener('click', (event) => {
    if(grid == null) return
    grid.clearAll()
  })


/**
 * Begins the pathfinding search with:
 *   - The selected pathfinding algorithm
 *   - The selected heuristic
 *   - Other configuration options
 */

document.getElementById('begin-search')
  .addEventListener('click', async (event) => {
    const algorithm = document.getElementById('algorithm').value
    const heuristic = document.getElementById('heuristic').value
    const search = Search.factory(algorithm, grid.cells, heuristic, grid.source, grid.target)
    if(search === undefined) return
    const results = await search.search()
    grid.highlightVertices(results.visitedVertices, Colors.visited)
    grid.highlightVertices(results.path, Colors.path)
    grid.highlightPath(results.path)
  })