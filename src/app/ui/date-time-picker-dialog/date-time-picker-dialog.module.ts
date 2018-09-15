import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../material/material.module';
import {DateTimePickerFragmentModule} from '../date-time-picker-fragment/date-time-picker-fragment.module';
import {DateTimePickerDialogComponent} from './date-time-picker-dialog/date-time-picker-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    DateTimePickerFragmentModule
  ],
  declarations: [
    DateTimePickerDialogComponent
  ],
  entryComponents: [
    DateTimePickerDialogComponent
  ],
  exports: [
    DateTimePickerDialogComponent
  ]
})
export class DateTimePickerDialogModule {
}
