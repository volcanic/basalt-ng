import {inject, TestBed} from '@angular/core/testing';

import {MaterialIconService} from './material-icon.service';
import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';

describe('MaterialIconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiImports],
      providers: [UiProviders]
    });
  });

  it('should be created', inject([MaterialIconService], (service: MaterialIconService) => {
    expect(service).toBeTruthy();
  }));
});
