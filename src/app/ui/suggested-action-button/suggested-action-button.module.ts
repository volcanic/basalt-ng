import {NgModule} from '@angular/core';
import {SuggestedActionButtonComponent} from './suggested-action-button/suggested-action-button.component';
import {SuggestedActionButtonImports} from './suggested-action-button.imports';
import {SuggestedActionButtonDeclarations} from './suggested-action-button.declaration';

@NgModule({
  imports: [SuggestedActionButtonImports],
  declarations: [SuggestedActionButtonDeclarations],
  entryComponents: [
    SuggestedActionButtonComponent
  ],
  exports: [
    SuggestedActionButtonComponent
  ]
})
export class SuggestedActionButtonModule {
}
