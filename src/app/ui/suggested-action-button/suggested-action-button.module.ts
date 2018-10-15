import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuggestedActionButtonComponent} from './suggested-action-button/suggested-action-button.component';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    SuggestedActionButtonComponent
  ],
  entryComponents: [
    SuggestedActionButtonComponent
  ],
  exports: [
    SuggestedActionButtonComponent
  ]
})
export class SuggestedActionButtonModule {
}
