import {inject, TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';
import {SettingsImports} from '../settings.imports';
import {SettingsProviders} from '../settings.providers';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsImports],
      providers: [SettingsProviders]
    });
  });

  it('should be created', inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));
});
