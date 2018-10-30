import {inject, TestBed} from '@angular/core/testing';

import {TaskletDisplayService} from './tasklet-display.service';

describe('TaskletDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskletDisplayService]
    });
  });

  it('should be created', inject([TaskletDisplayService], (service: TaskletDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
