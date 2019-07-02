import {NgModule} from '@angular/core';
import {MailImports} from './mail.imports';
import {MailProviders} from './mail.providers';

@NgModule({
  imports: [MailImports],
  declarations: [],
  providers: [MailProviders]
})
/**
 * Contains services related mails
 */
export class MailModule {
}
