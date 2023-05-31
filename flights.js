
let btn = document.querySelector("#startBtn");
btn.addEventListener("click", planItinerary);

let isAnimationRunning = false;

function createGraph(flightsGraph) {
    const nodes = Object.keys(flightsGraph).map((nodeName) => ({
      id: nodeName,
    }));
  
    const links = [];
  
    for (const source in flightsGraph) {
      for (const target in flightsGraph[source]) {
        links.push({ source, target });
      }
    }
  
    const width = 900;
    const height = 450;
    const nodeRadius = 12; // Increase the radius value to make the nodes larger
    const linkStrokeWidth = 2; // Increase the stroke width value to make the links larger
    const linkDistance = 150; // Increase the distance value to make the nodes further apart
  
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(linkDistance))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
  
    const svg = d3.select("#graph")
      .attr("width", width)
      .attr("height", height);
  
    const link = svg.selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke-width", linkStrokeWidth)
      .attr("data-source", (d) => d.source.id)
      .attr("data-target", (d) => d.target.id); 
  
    const node = svg.selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node");
  
    node.append("circle")
      .attr("r", nodeRadius);
  
    node.append("text")
      .attr("dx", nodeRadius + 4)
      .attr("dy", "0.35em")
      .text((d) => d.id)
      .style("font-size", "14px");
  
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
  
      node
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });
  }
  
  // Rest of the code...
  
  const flightsGraph = {
    A: { B: 2, C: 3 },
    B: { D: 4, E: 2 },
    C: { E: 3, F: 4 },
    D: { F: 2, C: 3 },
    E: { D: 1, F: 4 },
    F: { A: 2 },
    G: {G: 0}
  };
  
  createGraph(flightsGraph);

  let finalCost = 0;
// Uniform Cost Search algorithm
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

// Uniform Cost Search algorithm
async function animatedUniformCostSearch(graph, start, goal) {
    const visited = new Set();
    const queue = new PriorityQueue();
    const parent = {};
  
    // Initialize start node
    queue.enqueue({ node: start, cost: 0 });
  
    while (!queue.isEmpty()) {
      const { node, cost } = queue.dequeue();
  
      if (node === goal) {
        // Build the path from goal to start
        const path = [goal];
        let current = goal;
        while (current !== start) {
          const prev = parent[current];
          path.unshift(prev);
          current = prev;
        }

        return path;
      }
  
      if (!visited.has(node)) {
        visited.add(node);
  
        // Explore neighbors with animation
        const neighbors = graph[node];
        for (const neighbor in neighbors) {
          if (!visited.has(neighbor)) {
            const newCost = cost + neighbors[neighbor];
            queue.enqueue({ node: neighbor, cost: newCost });
            parent[neighbor] = node;
            await animateLinkTraversal(node, neighbor); // Animate link traversal
          }
        }
      }
    }
  
    // No path found
    return null;
  }
  

function animateLinkTraversal(source, target) {
    return new Promise((resolve) => {
      const link = d3.select(`line.link[data-source="${source}"][data-target="${target}"]`);
        console.log(link)
      // Animate the link by changing its stroke color temporarily
      link.transition()
        .duration(1000) // Animation duration (in milliseconds)
        .style("stroke", "red") // Change the stroke color
        .on("end", () => {
          link.style("stroke", "#999"); // Reset the stroke color
          resolve(); // Resolve the promise after animation completes
        });
    });
  }

// Priority Queue data structure
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

async function planItinerary() {
    isAnimationRunning = false;
    const startAirport = document.getElementById("startAirport").value;
    const goalAirport = document.getElementById("goalAirport").value;
    const resultDiv = document.getElementById("result");

    if(startAirport == goalAirport){
        resultDiv.textContent = "Can't be the same airport"
        return;
    }
    const shortestPath = uniformCostSearch(flightsGraph, startAirport, goalAirport);

    console.log(finalCost)
    if (shortestPath) {
        resultDiv.textContent = `Shortest path from ${startAirport} to ${goalAirport}: ${shortestPath.join(' ---> ')} | Final Cost: ${finalCost[goalAirport]}`;
    } else {
        resultDiv.textContent = `No path found from ${startAirport} to ${goalAirport}`;
    }

    // Animation
    isAnimationRunning = true;
    await animatedUniformCostSearch(flightsGraph, startAirport, goalAirport);
}


// Table
function visualizeFlightsGraph(graph) {
    const tableBody = document.querySelector("#flightTable tbody");

    for (const airport in graph) {
      const destinations = Object.keys(graph[airport]);
      const costs = Object.values(graph[airport]);

      const row = document.createElement("tr");

      const airportCell = document.createElement("td");
      airportCell.textContent = airport;
      row.appendChild(airportCell);

      const destinationsCell = document.createElement("td");
      destinationsCell.textContent = destinations.join(", ");
      row.appendChild(destinationsCell);

      const costsCell = document.createElement("td");
      costsCell.textContent = costs.join(", ");
      row.appendChild(costsCell);

      tableBody.appendChild(row);
    }
  }

  visualizeFlightsGraph(flightsGraph);