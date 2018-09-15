import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewFeaturesDialogComponent} from './new-features-dialog/new-features-dialog.component';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    NewFeaturesDialogComponent
  ],
  entryComponents: [
    NewFeaturesDialogComponent
  ],
  exports: [
    NewFeaturesDialogComponent
  ]
})
export class NewFeaturesDialogModule {
}
