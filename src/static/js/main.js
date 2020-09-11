import Grid from './Grid.js'
import Colors from './Colors.js'
import Search from './Search.js'

const app = document.querySelector('.app')

let ref
let results
let gridWidth = 10
let gridHeight = 10
let playbackSpeed = 1
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
    results = await search.search()
    grid.highlightVertices(results.visitedVertices, Colors.visited)
    grid.highlightVertices(results.path, Colors.path)
    grid.highlightPath(results.path)
    document.getElementById('search-replay').style.display = 'block'
    document.getElementById('max-iterations').innerHTML = results.stackTrace.length
  })


/**
 * Replay the last search using the playback options.
 */

document.getElementById('replay-search')
  .addEventListener('click', (event) => {
    if(results == null) return
    if(results.stackTrace == null) return
    if(ref != null) window.cancelAnimationFrame(ref)

    grid.clearSearch()

    let i = 0
    let prevTime = 0
    let fpsInterval = 1000 / playbackSpeed

    const loop = (timestamp) => {
      const delta = timestamp - prevTime

      if(i === results.stackTrace.length - 1) {
        grid.highlightVertices(results.path, Colors.path)
        grid.highlightPath(results.path)
        return
      }

      if(delta > fpsInterval) {
        i++
        prevTime = timestamp
        document.getElementById('iterations').value = i + 1
        renderSearchState(results.stackTrace[i])
      }

      ref = window.requestAnimationFrame(loop)
    }

    ref = window.requestAnimationFrame(loop)
  })


/**
 * Adjust the playback speed of the replay function
 */

document.getElementById('playback-speed')
  .addEventListener('change', (event) => {
    if(results == null) return
    if(results.stackTrace == null) return
    const min = Number.parseInt(event.target.getAttribute('min'))
    const max = Number.parseInt(event.target.getAttribute('max'))
    const speed = Number.parseInt(event.target.value)
    if(speed === null) return (event.target.value = playbackSpeed)
    if(speed < min) return (event.target.value = playbackSpeed)
    if(speed > max) return (event.target.value = playbackSpeed)
    playbackSpeed = speed
  })


/**
 * Show the replay from a particular iteration
 */

document.getElementById('iterations')
  .addEventListener('change', (event) => {
    if(results == null) return
    if(results.stackTrace == null) return
    const iteration = Number.parseInt(event.target.value)
    if(iteration == null) return
    if(iteration < 0) return
    if(iteration > results.stackTrace.length) return
    if(results.stackTrace[iteration] == null) return
    grid.clearSearch()

    for(let i = 0; i < iteration; i++) 
      renderSearchState(results.stackTrace[i])
  })
  

/**
 * Render the search state at a particular iteration
 */

const renderSearchState = (state) => {
  if(state === null) return
  state.current.highlight(Colors.visited)
  if(typeof state.frontier[Symbol.iterator] === 'function') {
    grid.highlightVertices(state.frontier, Colors.visited)
  }
}