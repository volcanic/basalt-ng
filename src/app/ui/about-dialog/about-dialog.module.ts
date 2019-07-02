import {NgModule} from '@angular/core';
import {AboutDialogComponent} from './about-dialog/about-dialog.component';
import {AboutDialogImports} from './about-dialog.imports';
import {AboutDialogDeclarations} from './about-dialog.declarations';

@NgModule({
  imports: [AboutDialogImports],
  declarations: [AboutDialogDeclarations],
  entryComponents: [
    AboutDialogComponent
  ],
  exports: [
    AboutDialogComponent
  ]
})
export class AboutDialogModule {
}
