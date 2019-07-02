import {inject, TestBed} from '@angular/core/testing';

import {CloneService} from './clone.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';

describe('CloneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [EntityProviders]
    });
  });

  it('should be created', inject([CloneService], (service: CloneService) => {
    expect(service).toBeTruthy();
  }));
});
