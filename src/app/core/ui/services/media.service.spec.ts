import {inject, TestBed} from '@angular/core/testing';

import {MediaService} from './media.service';
import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';

describe('MediaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiImports],
      providers: [UiProviders]
    });
  });

  it('should be created', inject([MediaService], (service: MediaService) => {
    expect(service).toBeTruthy();
  }));
});
