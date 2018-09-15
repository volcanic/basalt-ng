import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../material/material.module';
import {DateTimePickerFragmentComponent} from './date-time-picker-fragment/date-time-picker-fragment.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    DateTimePickerFragmentComponent
  ],
  exports: [
    DateTimePickerFragmentComponent
  ]
})
export class DateTimePickerFragmentModule {
}
