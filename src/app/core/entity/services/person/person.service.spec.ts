import {inject, TestBed} from '@angular/core/testing';

import {PersonService} from './person.service';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';
import {SuggestionService} from '../suggestion.service';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {ScopeService} from '../scope.service';

describe('PersonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityImports],
      providers: [
        EntityProviders,
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
        SuggestionService,
        SnackbarService,
        ScopeService
      ]
    });
  });

  it('should be created', inject([PersonService], (service: PersonService) => {
    expect(service).toBeTruthy();
  }));
});
