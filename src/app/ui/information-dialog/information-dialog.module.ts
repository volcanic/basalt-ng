import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InformationDialogComponent} from './information-dialog/information-dialog.component';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    InformationDialogComponent
  ],
  entryComponents: [
    InformationDialogComponent
  ],
  exports: [
    InformationDialogComponent
  ]
})
export class InformationDialogModule {
}
