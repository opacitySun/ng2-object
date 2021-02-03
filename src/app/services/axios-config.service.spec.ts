import { TestBed } from '@angular/core/testing';

import { AxiosConfigService } from './axios-config.service';

describe('AxiosConfigService', () => {
  let service: AxiosConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxiosConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
