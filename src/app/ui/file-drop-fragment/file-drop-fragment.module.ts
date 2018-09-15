import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileDropFragmentComponent} from './file-drop-fragment/file-drop-fragment.component';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule
  ],
  declarations: [
    FileDropFragmentComponent
  ],
  exports: [
    FileDropFragmentComponent
  ]
})
export class FileDropFragmentModule {
}
