import { TestBed, inject } from '@angular/core/testing';

import { MaterialColorService } from './material-color.service';

describe('MaterialColorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialColorService]
    });
  });

  it('should be created', inject([MaterialColorService], (service: MaterialColorService) => {
    expect(service).toBeTruthy();
  }));
});
