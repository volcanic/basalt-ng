import {inject, TestBed} from '@angular/core/testing';

import {DigestService} from './digest.service';
import {DigestImports} from '../../digest.imports';
import {TaskletService} from '../../../entity/services/tasklet/tasklet.service';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {PouchDBMServiceMock} from '../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../persistence/services/pouchdb-settings.service.mock';

describe('DigestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DigestImports],
      providers: [
        DigestService,
        TaskletService,
        {provide: PouchDBService, useClass: PouchDBMServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock}
      ],
    });
  });

  it('should be created', inject([DigestService], (service: DigestService) => {
    expect(service).toBeTruthy();
  }));
});
