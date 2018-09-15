import {inject, TestBed} from '@angular/core/testing';

import {TaskletService} from './tasklet.service';

describe('TaskletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskletService]
    });
  });

  it('should ...', inject([TaskletService], (service: TaskletService) => {
    expect(service).toBeTruthy();
  }));
});
