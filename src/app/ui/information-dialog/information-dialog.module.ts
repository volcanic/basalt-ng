import {NgModule} from '@angular/core';
import {InformationDialogComponent} from './information-dialog/information-dialog.component';
import {InformationDialogImports} from './information-dialog.imports';
import {InformationDialogDeclarations} from './information-dialog.declaration';

@NgModule({
  imports: [InformationDialogImports],
  declarations: [InformationDialogDeclarations],
  entryComponents: [
    InformationDialogComponent
  ],
  exports: [
    InformationDialogComponent
  ]
})
export class InformationDialogModule {
}
