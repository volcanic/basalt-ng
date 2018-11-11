import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskAutocompleteFragmentComponent} from './task-autocomplete-fragment/task-autocomplete-fragment.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [TaskAutocompleteFragmentComponent],
  entryComponents: [TaskAutocompleteFragmentComponent],
  exports: [TaskAutocompleteFragmentComponent]
})
export class TaskAutocompleteModule {
}
