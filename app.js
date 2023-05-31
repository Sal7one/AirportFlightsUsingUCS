
let btn = document.querySelector("#startBtn");
btn.addEventListener("click", planItinerary);

  const flightsGraph = {
    A: { B: 2, C: 3 },
    B: { D: 4, E: 2 },
    C: { E: 3, F: 4 },
    D: { F: 2, C: 3 },
    E: { D: 1, F: 4 },
    F: { A: 2 },
    G: {G: 0}
  };
  
  createD3Graph(flightsGraph);
  visualizeFlightsGraph(flightsGraph);

async function planItinerary() {
    const startAirport = document.getElementById("startAirport").value;
    const goalAirport = document.getElementById("goalAirport").value;
    const resultDiv = document.getElementById("result");

    if(startAirport == goalAirport){
        resultDiv.textContent = "Can't be the same airport"
        return;
    }
    const shortestPath = uniformCostSearch(flightsGraph, startAirport, goalAirport);

    if (shortestPath) {
        resultDiv.textContent = `Shortest path from ${startAirport} to ${goalAirport}: ${shortestPath.join(' ---> ')} | Final Cost: ${finalCost[goalAirport]}`;
    } else {
        resultDiv.textContent = `No path found from ${startAirport} to ${goalAirport}`;
    }

    await animatedUniformCostSearch(flightsGraph, startAirport, goalAirport);
}
