import {inject, TestBed} from '@angular/core/testing';

import {FeatureService} from './feature.service';
import {SettingsImports} from '../settings.imports';
import {SettingsProviders} from '../settings.providers';

describe('FeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsImports],
      providers: [SettingsProviders]
    });
  });

  it('should be created', inject([FeatureService], (service: FeatureService) => {
    expect(service).toBeTruthy();
  }));
});
