import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckableListComponent} from './checkable-list/checkable-list.component';
import {CheckableListItemComponent} from './checkable-list-item/checkable-list-item.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    CheckableListComponent,
    CheckableListItemComponent
  ],
  exports: [
    CheckableListComponent,
    CheckableListItemComponent
  ]
})
export class CheckableListModule {
}
