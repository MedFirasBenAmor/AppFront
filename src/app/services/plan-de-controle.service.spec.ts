import { TestBed } from '@angular/core/testing';

import { PlanDeControleService } from './plan-de-controle.service';

describe('PlanDeControleService', () => {
  let service: PlanDeControleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanDeControleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
