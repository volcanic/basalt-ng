import {inject, TestBed} from '@angular/core/testing';

import {ScopeService} from './scope.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';

describe('ScopeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [EntityProviders]
    });
  });

  it('should be created', inject([ScopeService], (service: ScopeService) => {
    expect(service).toBeTruthy();
  }));
});
