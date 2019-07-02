import {NgModule} from '@angular/core';
import {NewFeaturesDialogComponent} from './new-features-dialog/new-features-dialog.component';
import {NewFeaturesDialogImports} from './new-features-dialog.imports';
import {NewFeaturesDialogDeclarations} from './new-features-dialog.declaration';

@NgModule({
  imports: [NewFeaturesDialogImports],
  declarations: [NewFeaturesDialogDeclarations],
  entryComponents: [
    NewFeaturesDialogComponent
  ],
  exports: [
    NewFeaturesDialogComponent
  ]
})
export class NewFeaturesDialogModule {
}
