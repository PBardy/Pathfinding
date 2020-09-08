import Colors from './Colors.js'

export default class Vertex {

  #accessible = true

  neighbors = []
  parent = null
  isSourceNode = false
  domElement = document.createElement('div')

  constructor(container, row, column) {
    this.row = row
    this.column = column
    this.id = `${row}_${column}`
    this.onclick = this.onclick.bind(this)
    this.oncontextmenu = this.oncontextmenu.bind(this)
    this.domElement.addEventListener('click', this.onclick)
    this.domElement.addEventListener('contextmenu', this.oncontextmenu)
    container.appendChild(this.domElement)
  }

  get accessible() {
    return this.#accessible
  }

  set accessible(value) {
    this.#accessible = value
    this.domElement.style.backgroundColor = (
      this.#accessible ? Colors.empty : Colors.wall 
    )
  }

  onclick(event) {
    if(this.isSourceNode) return
    if(this.accessible === false) return
    this.accessible = false
  }

  oncontextmenu(event) {
    event.preventDefault()
    if(this.isSourceNode) return
    this.accessible = true
  }

  highlight(color) {
    if(this.isSourceNode && this.domElement.style.backgroundColor) return
    this.domElement.style.backgroundColor = color
  }

  clearPath() {
    this.domElement.className = ""
  }

}