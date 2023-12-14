import { TspSolver } from "./TspSolverBridge";

export default class TspNearestNeighbor implements TspSolver {
  findOptimalSolution(distances: number[][]): any {
    const numLocations = distances.length;
    const visitedNodes: number[] = [];
    let totalDistance = 0;

    // Start from the first location (node 0)
    let currentNode = 0;
    visitedNodes.push(currentNode);

    while (visitedNodes.length < numLocations) {
      let nearestNode = -1;
      let minDistance = Number.MAX_VALUE;

      // Find the nearest unvisited node
      for (let nextNode = 0; nextNode < numLocations; nextNode++) {
        if (!visitedNodes.includes(nextNode) && distances[currentNode][nextNode] < minDistance) {
          nearestNode = nextNode;
          minDistance = distances[currentNode][nextNode];
        }
      }

      if (nearestNode !== -1) {
        visitedNodes.push(nearestNode);
        totalDistance += minDistance;
        currentNode = nearestNode;
      }

    }

    // aggiungi tempo per svuotare ogni cestino
    totalDistance = totalDistance + distances.length * 160;
    return { path: visitedNodes, distance: totalDistance };
  }
}
