import {inject, TestBed} from '@angular/core/testing';

import {MaterialIconService} from './material-icon.service';

describe('MaterialIconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialIconService]
    });
  });

  it('should be created', inject([MaterialIconService], (service: MaterialIconService) => {
    expect(service).toBeTruthy();
  }));
});
