import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {DateTimePickerFragmentModule} from '../date-time-picker-fragment/date-time-picker-fragment.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/** Imports for date time picker module */
export const DateTimePickerDialogImports = [
  CommonModule,
  BrowserAnimationsModule,
  MaterialModule,
  DateTimePickerFragmentModule
];
