import { TestBed } from '@angular/core/testing';

import { KycApiService } from './kyc-api.service';

describe('KycApiService', () => {
  let service: KycApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
