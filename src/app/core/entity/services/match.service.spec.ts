import {inject, TestBed} from '@angular/core/testing';

import {MatchService} from './match.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../persistence/services/pouchdb-settings.service.mock';
import {ProjectService} from './project/project.service';
import {TaskService} from './task/task.service';
import {TaskletService} from './tasklet/tasklet.service';
import {TagService} from './tag/tag.service';
import {PersonService} from './person/person.service';

describe('MatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        ProjectService,
        TaskService,
        TaskletService,
        TagService,
        PersonService
      ]
    });
  });

  it('should ...', inject([MatchService], (service: MatchService) => {
    expect(service).toBeTruthy();
  }));
});
