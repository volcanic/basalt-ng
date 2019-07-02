import {NgModule} from '@angular/core';
import {PreviousDescriptionFragmentComponent} from './previous-description-fragment/previous-description-fragment.component';
import {PreviousDescriptionImports} from './previous-description.imports';
import {PreviousDescriptionDeclarations} from './previous-description.declaration';

@NgModule({
  imports: [PreviousDescriptionImports],
  declarations: [PreviousDescriptionDeclarations],
  entryComponents: [
    PreviousDescriptionFragmentComponent
  ],
  exports: [
    PreviousDescriptionFragmentComponent
  ]
})
export class PreviousDescriptionModule {
}
