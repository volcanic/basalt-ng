import {inject, TestBed} from '@angular/core/testing';

import {PouchDBService} from './pouchdb.service';

describe('PouchdbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PouchDBService]
    });
  });

  it('should ...', inject([PouchDBService], (service: PouchDBService) => {
    expect(service).toBeTruthy();
  }));
});
