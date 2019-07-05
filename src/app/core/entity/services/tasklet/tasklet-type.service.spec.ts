import {inject, TestBed} from '@angular/core/testing';

import {TaskletTypeService} from './tasklet-type.service';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';
import {SettingsService} from '../../../settings/services/settings.service';

describe('TaskletTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        SettingsService
      ]
    });
  });

  it('should be created', inject([TaskletTypeService], (service: TaskletTypeService) => {
    expect(service).toBeTruthy();
  }));
});
