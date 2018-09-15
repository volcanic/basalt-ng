import {inject, TestBed} from '@angular/core/testing';

import {ScopeService} from './scope.service';

describe('ScopeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScopeService]
    });
  });

  it('should be created', inject([ScopeService], (service: ScopeService) => {
    expect(service).toBeTruthy();
  }));
});
