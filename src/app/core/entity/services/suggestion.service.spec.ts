import {inject, TestBed} from '@angular/core/testing';

import {SuggestionService} from './suggestion.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';

describe('SuggestionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [EntityProviders]
    });
  });

  it('should be created', inject([SuggestionService], (service: SuggestionService) => {
    expect(service).toBeTruthy();
  }));
});
