import {inject, TestBed} from '@angular/core/testing';

import {EmailService} from './email.service';
import {MailImports} from '../../mail.imports';
import {MailProviders} from '../../mail.providers';

describe('EmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MailImports],
      providers: [MailProviders]
    });
  });

  it('should be created', inject([EmailService], (service: EmailService) => {
    expect(service).toBeTruthy();
  }));
});
