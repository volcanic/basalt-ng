import {inject, TestBed} from '@angular/core/testing';

import {EntityService} from './projects.service';

describe('EntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntityService]
    });
  });

  it('should be created', inject([EntityService], (service: EntityService) => {
    expect(service).toBeTruthy();
  }));
});
