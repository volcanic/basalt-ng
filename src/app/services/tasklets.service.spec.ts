import {inject, TestBed} from '@angular/core/testing';

import {TaskletsService} from './tasklets.service';

describe('TaskletsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskletsService]
    });
  });

  it('should ...', inject([TaskletsService], (service: TaskletsService) => {
    expect(service).toBeTruthy();
  }));
});
