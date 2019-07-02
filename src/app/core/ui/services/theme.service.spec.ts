import {inject, TestBed} from '@angular/core/testing';

import {ThemeService} from './theme.service';
import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';

describe('ThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiImports],
      providers: [UiProviders]
    });
  });

  it('should be created', inject([ThemeService], (service: ThemeService) => {
    expect(service).toBeTruthy();
  }));
});
