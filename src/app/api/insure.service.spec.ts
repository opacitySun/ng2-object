import { TestBed } from '@angular/core/testing';

import { InsureService } from './insure.service';

describe('InsureService', () => {
  let service: InsureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
