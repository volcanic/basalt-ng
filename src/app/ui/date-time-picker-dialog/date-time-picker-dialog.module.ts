import {NgModule} from '@angular/core';
import {DateTimePickerDialogComponent} from './date-time-picker-dialog/date-time-picker-dialog.component';
import {DateTimePickerDialogImports} from './date-time-picker-dialog.imports';
import {DateTimePickerDialogDeclarations} from './date-time-picker-dialog.declaration';

@NgModule({
  imports: [DateTimePickerDialogImports],
  declarations: [DateTimePickerDialogDeclarations],
  entryComponents: [
    DateTimePickerDialogComponent
  ],
  exports: [
    DateTimePickerDialogComponent
  ]
})
export class DateTimePickerDialogModule {
}
