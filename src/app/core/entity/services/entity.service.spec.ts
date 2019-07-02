import {inject, TestBed} from '@angular/core/testing';

import {EntityService} from './entity.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../persistence/services/pouchdb-settings.service.mock';
import {ProjectService} from './project.service';
import {TaskService} from './task/task.service';
import {TaskletService} from './tasklet/tasklet.service';
import {TagService} from './tag.service';
import {PersonService} from './person.service';

describe('EntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        ProjectService,
        TaskService,
        TaskletService,
        TagService,
        PersonService
      ]
    });
  });

  it('should be created', inject([EntityService], (service: EntityService) => {
    expect(service).toBeTruthy();
  }));
});
