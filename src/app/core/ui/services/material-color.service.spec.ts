import {inject, TestBed} from '@angular/core/testing';

import {MaterialColorService} from './material-color.service';
import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';

describe('MaterialColorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiImports],
      providers: [UiProviders]
    });
  });

  it('should be created', inject([MaterialColorService], (service: MaterialColorService) => {
    expect(service).toBeTruthy();
  }));
});
