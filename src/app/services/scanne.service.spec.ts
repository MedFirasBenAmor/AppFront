import { TestBed } from '@angular/core/testing';

import { ScanneService } from './scanne.service';

describe('ScanneService', () => {
  let service: ScanneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
