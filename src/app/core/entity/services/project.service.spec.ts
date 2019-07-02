import {inject, TestBed} from '@angular/core/testing';

import {ProjectService} from './project.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../persistence/services/pouchdb-settings.service.mock';
import {SuggestionService} from './suggestion.service';
import {SnackbarService} from '../../ui/services/snackbar.service';
import {ScopeService} from './scope.service';

describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        SuggestionService,
        SnackbarService,
        ScopeService
      ]
    });
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));
});
