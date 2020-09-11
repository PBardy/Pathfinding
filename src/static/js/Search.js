import { PriorityQueue } from './Queue.js'

export class State {

  constructor(current, frontier, visited) {
    this.current = current
    this.frontier = frontier
    this.visited = visited
  }

}


export default class Search {

  static MAX_ITERATIONS = 10000

  stackTrace = []
  visited = []
  visitedVertices = []

  constructor(graph, heuristic, source, target) {
    this.graph = graph
    this.heuristic = heuristic
    this.source = source
    this.target = target
  }

  /**
   * Reset vertex parents, so future searches work.
   * It's always good to tidy up after yourself...
   * 
   */
  tidyUp() {
    for(let row = 0; row < this.graph.length; row++) {
      for(let column = 0; column < this.graph[row].length; column++) {
        const cell = this.graph[row][column]
        cell.parent = null
        cell.heuristicData = {}
      }
    }
  }

  /**
   * Ideally this should be an abstract method of an abstract class,
   * but certain methods expect a search state to be returned, so we'll just
   * give them an empty one, so things don't break. 
   *  
   */
  async search() {
    return this
  }

  /**
   * Find the root of the parent tree we've created
   * Better follow those breadcrumbs home Hansel & Gretel
   * 
   * @param {*} target 
   */
  async retraceFootsteps(target) {

    let current = target
    let path = []

    while(current.parent !== null) {
      path.unshift(current)
      if(current.id === this.source.id) break // we're back home!
      current = current.parent
    }

    return path // return the path so we don't get lost in the woods again
  }

  static factory(type, graph, heuristic, source, target) {
    if(type === 'as')  return new AStarSearch(graph, heuristic, source, target)
    if(type === 'bfs') return new BreadthFirstSearch(graph, heuristic, source, target)
    if(type === 'dfs') return new DepthFirstSearch(graph, heuristic, source, target)
    if(type === 'dij') return new DijkstraSearch(graph, heuristic, source, target)
    if(type === 'ida') return new IDASearch(graph, heuristic, source, target)
    if(type === 'jps') return new JumpPointSearch(graph, heuristic, source, target)
    if(type === 'ops') return new OrthogonalPointSearch(graph, heuristic, source, target)
    if(type === 'trc') return new TraceSearch(graph, heuristic, source, target)
  }

}


export class AStarSearch extends Search {

  constructor(graph, heuristic, source, target) {
    super(graph, heuristic, source, target)
  }
  
  async search() {

    let current
    let frontier = new PriorityQueue()
    let iteration = 0

    frontier.enqueue(this.heuristic(this.source), this.source)

    while(openSet.length > 0 && iteration < Search.MAX_ITERATIONS) {
      iteration++
      current = frontier.dequeue()

      if(current.id === this.target.id) {
        this.path = await this.retraceFootsteps(current)
        this.tidyUp()
        break
      }

      this.visited.push(current.id)
      this.visitedVertices.push(current)
      this.stackTrace.push(new State(current, [...this.frontier], [...this.visited])) // update stack trace

      neighbors = current.neighbors
      neighbors.forEach((neighbor) => {
        const gScore = current.gScore + 1
        const gScoreIsBest = false
        if(!this.visited.includes(neighbor.id)) {
          gScoreIsBest = true
          neighbor.h = this.heuristic(neighbor.pos, end.pos)
          frontier.enqueue(neighbor)
        } else if(gScore < neighbor.g) {
          gScoreIsBest = true
        }

        if(gScoreIsBest) {
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }

      })

    }

  }

}


export class BreadthFirstSearch extends Search {

  frontier = []

  constructor(graph, heuristic, source, target) {
    super(graph, heuristic, source, target)
  }

  async search() {

    this.frontier.push(this.source) // add source to frontier 

    let current
    let neighbors
    let iteration = 0

    while(this.frontier.length > 0) { // while there is a frontier to explore
      iteration++
      current = this.frontier.shift()

      if(current.accessible === false) continue
 
      if(current.id === this.target.id) { // we found a match!
        this.path = await this.retraceFootsteps(current)
        this.tidyUp()
        break
      }

      this.visited.push(current.id)
      this.visitedVertices.push(current)
      this.stackTrace.push(new State(current, [...this.frontier], [...this.visited])) // update stack trace

      neighbors = current.neighbors // explore unexplored neighbors
      neighbors.forEach((neighbor) => {
        if(this.frontier.includes(neighbor.id)) return // prevent duplicates
        if(this.visited.includes(neighbor.id)) return
        neighbor.parent = current
        this.frontier.push(neighbor) // expand the frontier
      })

    }

    return this

  }

}


export class DepthFirstSearch extends Search {

  frontier = []

  constructor(graph, heuristic, source, target) {
    super(graph, heuristic, source, target)
  }

  async search() {

    this.frontier.push(this.source) // add source to frontier 

    let current
    let neighbors
    let iteration = 0

    while(this.frontier.length > 0) { // while there is a frontier to explore
      iteration++
      current = this.frontier.pop()

      if(current.id === this.target.id) { // we found a match!
        this.path = await this.retraceFootsteps(current)
        this.tidyUp()
        break
      }

      this.visited.push(current.id)
      this.visitedVertices.push(current)
      this.stackTrace.push(new State(current, [...this.frontier], [...this.visited])) // update stack trace

      neighbors = current.neighbors // explore unexplored neighbors
      neighbors.forEach((neighbor) => {
        if(this.frontier.includes(neighbor.id)) return // prevent duplicates
        if(this.visited.includes(neighbor.id)) return
        neighbor.parent = current
        this.frontier.push(neighbor) // expand the frontier
      })

    }

    return this

  }

}


export class DijkstraSearch extends Search {

  constructor(graph, heuristic, source, target) {
    super(graph, heuristic, source, target)
  }

  async search() {

    let iteration = 0
    let dist = {}
    let prev = {}
    let queue = {}
    let vertices = this.graph.flat()

    function length(u, v) {
      const dr = u.row - v.row
      const dc = u.column - v.column
      return Math.sqrt(Math.pow(dr, 2), Math.pow(dc, 2))
    }

    function shortest(q, keys) {
      let val = q[keys[0]]
      let shortest = keys[0]

      for(let key of keys) {
        if(q[key] < val) {
          val = q[key]
          shortest = key
        }
      }

      return shortest
    }

    for(let vertex of vertices) {
      dist[vertex.id] = 1000000
      prev[vertex.id] = undefined
      queue[vertex.id] = vertex
    }

    dist[this.source.id] = 0

    while(Object.keys(queue).length > 0 && iteration < Search.MAX_ITERATIONS) {
      iteration++
      const u = shortest(dist, Object.keys(queue))
      const current = queue[u]

      delete queue[u]

      if(this.visited.includes(u)) continue
      if(current.accessible === false) continue

      this.visited.push(u)
      this.visitedVertices.push(current)
      this.stackTrace.push(new State(current, queue, this.visited)) // update stack trace

      if(u === this.target.id) {
        this.path = await this.retraceFootsteps(current)
        return this 
      }

      if(current == null) continue
      
      for(let neighbor of current.neighbors) {
        if(this.visited.includes(neighbor.id)) continue
        const alt = dist[u] + length(current, neighbor)
        if(alt < dist[neighbor.id]) {
          dist[neighbor.id] = alt
          prev[neighbor.id] = u
          neighbor.parent = current
        }
      }

    }

    return this
  }

}