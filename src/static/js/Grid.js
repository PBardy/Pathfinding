import Colors from './Colors.js'
import Vertex from './Vertex.js'

export default class Grid {

  constructor(app, width, height) {
    this.app = app
    this.width = width
    this.height = height
    this.cells = new Array(height)
  }

  getCell(row, column) {
    if(row < 0 || column < 0) return
    if(this.cells[row] == null) return
    return this.cells[row][column]
  }

  getCellByCoords(coords) {
    if(coords == null) return
    const [row, column] = coords
    return this.getCell(row, column)
  }

  getRandomCoords() {
    do {
      const randR = Math.floor((Math.random() * (this.height - 1)))
      const randC = Math.floor((Math.random() * (this.width - 1)))
      const coords = [randR, randC]
      const id = randR + '_' + randC
  
      if(!this.occupied.includes(id)) {
        this.occupied.push(id)
        return coords
      }
  
    } while(true)
  }

  highlightVertex(vertex, color) {
    if(vertex == null) return
    if(vertex.isSourceNode && vertex.domElement.style.backgroundColor) return
    vertex.domElement.style.backgroundColor = color
  }

  highlightVertices(vertices, color) {
    if(vertices == null) return
    if(vertices.length == 0) return
    vertices.forEach(vertex => this.highlightVertex(vertex, color))
  }

  highlightPath(path) {
    if(path == null) return
    if(path.length == 0) return

    let last = this.source

    for(let i = 0; i < path.length; i++) {
      const current = path[i]
      const dr = last.row - current.row
      const dc = last.column - current.column

      if(dr === 1 && dc === 0) {
        last.domElement.classList.add('north')
        current.domElement.classList.add('south')
      }
      
      if(dr === -1 && dc === 0) {
        last.domElement.classList.add('south')
        current.domElement.classList.add('north')
      }
      
      if(dr === 0 && dc === 1) {
        last.domElement.classList.add('west')
        current.domElement.classList.add('east')
      }
      
      if(dr === 0 && dc === -1) {
        last.domElement.classList.add('east')
        current.domElement.classList.add('west')
      }

      last = current
    }

  }

  build() {

    this.app.innerHTML = ""
    this.app.style.gridTemplateRows = `repeat(${this.height}, auto)`
    this.app.style.gridTemplateColumns = `repeat(${this.width}, auto)`

    for(let row = 0; row < this.height; row++) {
      this.cells[row] = new Array(this.width)
      for(let column = 0; column < this.width; column++)
        this.cells[row][column] = new Vertex(this.app, row, column)
    }

    this.pairAdjacentVertices()
    this.occupied = []
    this.source = this.getCellByCoords(this.getRandomCoords())
    this.target = this.getCellByCoords(this.getRandomCoords())
    this.source.isSourceNode = true
    this.target.isSourceNode = true
    this.source.highlight(Colors.source)
    this.target.highlight(Colors.target)

    return this
  }

  clearWalls() {
    for(let row = 0; row < this.height; row++) {
      for(let column = 0; column < this.width; column++) {
        const vertex = this.getCell(row, column)
        if(vertex == null) continue
        if(vertex.isSourceNode) continue
        if(vertex.accessible) continue
        vertex.accessible = true
      }
    }
  }

  clearSearch() {
    for(let row = 0; row < this.height; row++) {
      for(let column = 0; column < this.width; column++) {
        const vertex = this.getCell(row, column)
        if(vertex == null) continue
        if(vertex.isSourceNode) continue
        if(vertex.accessible === false) continue
        vertex.clearPath()
        vertex.highlight(Colors.empty)
      }
    }
  }

  clearAll() {
    this.clearWalls()
    this.clearSearch()
  }

  pairAdjacentVertices() {
    for(let row = 0; row < this.height; row++) {
      for(let column = 0; column < this.width; column++) {
        const target = this.getCell(row, column)
        if(target == null) continue
        target.neighbors.push(this.getCell(row - 1, column + 0)) // NORTH
        target.neighbors.push(this.getCell(row + 0, column + 1)) // EAST
        target.neighbors.push(this.getCell(row + 1, column + 0)) // SOUTH
        target.neighbors.push(this.getCell(row + 0, column - 1)) // WEST
        target.neighbors = target.neighbors.filter(n => n !== undefined)
      }
    }
  }

}