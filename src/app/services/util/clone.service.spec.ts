import { TestBed, inject } from '@angular/core/testing';

import { CloneService } from './clone.service';

describe('CloneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloneService]
    });
  });

  it('should be created', inject([CloneService], (service: CloneService) => {
    expect(service).toBeTruthy();
  }));
});
