import {NgModule} from '@angular/core';
import {TaskAutocompleteFragmentComponent} from './task-autocomplete-fragment/task-autocomplete-fragment.component';
import {TaskAutocompleteImports} from './task-autocomplete.imports';
import {TaskAutocompleteDeclarations} from './task-autocomplete.declaration';

@NgModule({
  imports: [TaskAutocompleteImports],
  declarations: [TaskAutocompleteDeclarations],
  entryComponents: [
    TaskAutocompleteFragmentComponent
  ],
  exports: [
    TaskAutocompleteFragmentComponent
  ]
})
export class TaskAutocompleteModule {
}
