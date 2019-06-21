import {TestBed} from '@angular/core/testing';

import {NotificationService} from './notification.service';
import {NotificationImports} from '../notification.imports';
import {NotificationProviders} from '../notification.providers';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [NotificationImports],
    providers: [NotificationProviders]
  }));

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });
});
