import {NgModule} from '@angular/core';
import {TagChipsComponent} from './tag-chips/tag-chips.component';
import {TagChipsImports} from './tag-chips.imports';
import {TagChipsDeclarations} from './tag-chips.declaration';

@NgModule({
  imports: [TagChipsImports],
  declarations: [TagChipsDeclarations],
  entryComponents: [
    TagChipsComponent
  ],
  exports: [
    TagChipsComponent
  ],
})
export class TagChipsModule {
}
