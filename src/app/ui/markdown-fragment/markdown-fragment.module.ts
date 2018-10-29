import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarkdownEditorComponent} from './markdown-editor/markdown-editor.component';
import {MarkdownPreviewComponent} from './markdown-preview/markdown-preview.component';
import {MaterialModule} from '../material/material.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    MarkdownEditorComponent,
    MarkdownPreviewComponent
  ],
  entryComponents: [
    MarkdownEditorComponent,
    MarkdownPreviewComponent
  ],
  exports: [
    MarkdownEditorComponent,
    MarkdownPreviewComponent
  ]
})
export class MarkdownFragmentModule {
}
