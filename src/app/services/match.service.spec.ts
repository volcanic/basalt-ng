import {inject, TestBed} from '@angular/core/testing';

import {MatchService} from './match.service';

describe('MatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchService]
    });
  });

  it('should ...', inject([MatchService], (service: MatchService) => {
    expect(service).toBeTruthy();
  }));
});
