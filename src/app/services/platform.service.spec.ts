/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlatformService]
    });
  });

  it('should ...', inject([PlatformService], (service: PlatformService) => {
    expect(service).toBeTruthy();
  }));
});
