import {NgModule} from '@angular/core';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogImports} from './confirmation-dialog.imports';
import {ConfirmationDialogDeclarations} from './confirmation-dialog.declaration';

@NgModule({
  imports: [ConfirmationDialogImports],
  declarations: [ConfirmationDialogDeclarations],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent
  ]
})
export class ConfirmationDialogModule {
}
