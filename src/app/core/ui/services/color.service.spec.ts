import {inject, TestBed} from '@angular/core/testing';

import {ColorService} from './color.service';
import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';

describe('ColorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiImports],
      providers: [UiProviders]
    });
  });

  it('should be created', inject([ColorService], (service: ColorService) => {
    expect(service).toBeTruthy();
  }));
});
