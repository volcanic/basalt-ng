import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PouchDBService} from './services/pouchdb.service';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    PouchDBService,
    PouchDBSettingsService
  ]
})
/**
 * Contains services related to persistence
 */
export class PersistenceModule {
}
