import { TestBed, inject } from '@angular/core/testing';

import { PouchDBSettingsService } from './pouchdb-settings.service';

describe('PouchDBSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PouchDBSettingsService]
    });
  });

  it('should be created', inject([PouchDBSettingsService], (service: PouchDBSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
