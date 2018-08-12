import { TestBed, inject } from '@angular/core/testing';

import { DigestService } from './digest.service';

describe('DigestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DigestService]
    });
  });

  it('should be created', inject([DigestService], (service: DigestService) => {
    expect(service).toBeTruthy();
  }));
});
