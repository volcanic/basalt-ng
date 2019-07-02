import {inject, TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {EntityProviders} from '../../entity.providers';
import {EntityImports} from '../../entity.imports';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';
import {ProjectService} from '../project.service';
import {TagService} from '../tag.service';
import {SuggestionService} from '../suggestion.service';
import {ScopeService} from '../scope.service';

describe('TaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        ProjectService,
        TagService,
        SuggestionService,
        ScopeService
      ]
    });
  });

  it('should be created', inject([TaskService], (service: TaskService) => {
    expect(service).toBeTruthy();
  }));
});
