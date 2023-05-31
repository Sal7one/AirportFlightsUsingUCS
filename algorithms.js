class PriorityQueue {
    constructor() {
    this.elements = [];
    }
    
    enqueue(element) {
    let inserted = false;
    for (let i = 0; i < this.elements.length; i++) {
      if (element.cost < this.elements[i].cost) {
        this.elements.splice(i, 0, element);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.elements.push(element);
    }
    }
    
    dequeue() {
    return this.elements.shift();
    }
    
    isEmpty() {
    return this.elements.length === 0;
    }

}


function uniformCostSearch(graph, start, goal) {
  const visited = new Set();
  const queue = new PriorityQueue();
  const parent = {};
  const costs = {}; // keep track of costs to nodes

  costs[start] = 0; // initialize start node cost to 0
  queue.enqueue({ node: start, cost: 0 });

  while (!queue.isEmpty()) {
      const { node, cost } = queue.dequeue();

      if (node === goal) {
          const path = [goal];
          let current = goal;
          while (current !== start) {
              const prev = parent[current];
              path.unshift(prev);
              current = prev;
          }
          finalCost = costs;
          return path;
      }

      if (!visited.has(node)) {
          visited.add(node);
          const neighbors = graph[node];
          for (const neighbor in neighbors) {
              const newCost = cost + neighbors[neighbor];
              if (!costs[neighbor] || newCost < costs[neighbor]) {
                  costs[neighbor] = newCost; // update cost
                  parent[neighbor] = node;
                  queue.enqueue({ node: neighbor, cost: newCost });
              }
          }
      }
  }

  return null; // no path found
}