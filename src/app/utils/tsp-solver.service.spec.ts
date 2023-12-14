import { TestBed } from '@angular/core/testing';

import { TspSolverService } from './tsp-solver.service';

describe('TspSolverService', () => {
  let service: TspSolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TspSolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
