import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailService} from './services/mail/email.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [EmailService]
})
/**
 * Contains services related mails
 */
export class MailModule {
}
