import {inject, TestBed} from '@angular/core/testing';

import {TaskletTypeService} from './tasklet-type.service';

describe('TaskletTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskletTypeService]
    });
  });

  it('should be created', inject([TaskletTypeService], (service: TaskletTypeService) => {
    expect(service).toBeTruthy();
  }));
});
