import {inject, TestBed} from '@angular/core/testing';

import {TaskletDisplayService} from './tasklet-display.service';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';
import {DateService} from '../date.service';
import {TaskService} from '../task/task.service';
import {TaskletTypeService} from './tasklet-type.service';

describe('TaskletDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        DateService,
        TaskService,
        TaskletTypeService
      ]
    });
  });

  it('should be created', inject([TaskletDisplayService], (service: TaskletDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
