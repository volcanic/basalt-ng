import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutDialogComponent} from './about-dialog/about-dialog.component';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    AboutDialogComponent
  ],
  entryComponents: [
    AboutDialogComponent
  ],
  exports: [
    AboutDialogComponent
  ]
})
export class AboutDialogModule {
}
