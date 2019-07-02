import {NgModule} from '@angular/core';
import {DateTimePickerFragmentComponent} from './date-time-picker-fragment/date-time-picker-fragment.component';
import {DateTimePickerFragmentDeclarations} from './date-time-picker-fragment.declarations';
import {DateTimePickerFragmentImports} from './date-time-picker-fragment.imports';

@NgModule({
  imports: [DateTimePickerFragmentImports],
  declarations: [DateTimePickerFragmentDeclarations],
  exports: [
    DateTimePickerFragmentComponent
  ]
})
export class DateTimePickerFragmentModule {
}
