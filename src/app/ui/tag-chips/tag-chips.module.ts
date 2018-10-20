import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {TagChipsComponent} from './tag-chips/tag-chips.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [TagChipsComponent],
  entryComponents: [TagChipsComponent],
  exports: [TagChipsComponent],
})
export class TagChipsModule {
}
