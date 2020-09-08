export class Queue {

  items = []

  isEmpty() {
    return this.items.length === 0
  }

  enqueue(item) {
    this.items.push(item)
  }

  dequeue() {
    return this.items.shift()
  }

}


export class PriorityQueueItem {

  constructor(priority, value) {
    this.priority = priority
    this.value = value
  }

}


export class PriorityQueue extends Queue {

  enqueue(priority, item) {
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i].priority <= priority) {
        this.items.insert(i, item)
      }
    }
  }

}