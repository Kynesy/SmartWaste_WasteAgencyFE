import { Injectable } from '@angular/core';
import { TspSolver } from './TspSolverBridge';
import TspNearestNeighbor from './TspNearestNeighbor';

@Injectable({
  providedIn: 'root'
})
export class TspSolverService {

  getSolver(): TspSolver {
    return new TspNearestNeighbor(); // Return the specific implementation
  }

  constructor() { }
}
