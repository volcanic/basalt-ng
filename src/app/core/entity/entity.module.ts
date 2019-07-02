import {NgModule} from '@angular/core';
import {EntityProviders} from './entity.providers';
import {EntityImports} from './entity.imports';

@NgModule({
  imports: [EntityImports],
  declarations: [],
  providers: [EntityProviders]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
