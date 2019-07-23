import {NgModule} from '@angular/core';
import {ProjectPickerImports} from './project-picker.imports';
import {ProjectPickerDeclarations} from './project-picker.declaration';
import {ProjectPickerFragmentComponent} from './project-picker-fragment/project-picker-fragment.component';

@NgModule({
  imports: [ProjectPickerImports],
  declarations: [ProjectPickerDeclarations],
  entryComponents: [
    ProjectPickerFragmentComponent
  ],
  exports: [
    ProjectPickerFragmentComponent
  ]
})
export class ProjectPickerModule {
}


