import {inject, TestBed} from '@angular/core/testing';

import {SnackbarService} from './snackbar.service';
import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';

describe('SnackbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiImports],
      providers: [UiProviders]
    });
  });

  it('should ...', inject([SnackbarService], (service: SnackbarService) => {
    expect(service).toBeTruthy();
  }));
});
