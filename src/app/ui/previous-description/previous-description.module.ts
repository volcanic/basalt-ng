import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {PreviousDescriptionFragmentComponent} from './previous-description-fragment/previous-description-fragment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [PreviousDescriptionFragmentComponent],
  entryComponents: [PreviousDescriptionFragmentComponent],
  exports: [PreviousDescriptionFragmentComponent]
})
export class PreviousDescriptionModule {
}
