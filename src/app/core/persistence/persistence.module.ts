import {NgModule} from '@angular/core';
import {PersistenceImports} from './persistence.imports';
import {PersistenceProviders} from './persistence.providers';

@NgModule({
  imports: [PersistenceImports],
  declarations: [],
  providers: [PersistenceProviders]
})
/**
 * Contains services related to persistence
 */
export class PersistenceModule {
}
