import {inject, TestBed} from '@angular/core/testing';

import {TaskletService} from './tasklet.service';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';
import {ProjectService} from '../project.service';
import {TaskService} from '../task/task.service';
import {TagService} from '../tag.service';
import {PersonService} from '../person.service';
import {DateService} from '../date.service';
import {SuggestionService} from '../suggestion.service';
import {ScopeService} from '../scope.service';
import {TaskletDisplayService} from './tasklet-display.service';
import {TaskletTypeService} from './tasklet-type.service';

describe('TaskletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        ProjectService,
        TaskService,
        TagService,
        PersonService,
        DateService,
        SuggestionService,
        ScopeService,
        TaskletDisplayService,
        TaskletTypeService
      ]
    });
  });

  it('should ...', inject([TaskletService], (service: TaskletService) => {
    expect(service).toBeTruthy();
  }));
});
