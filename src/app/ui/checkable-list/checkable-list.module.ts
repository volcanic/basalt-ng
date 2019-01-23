import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckableListComponent} from './checkable-list/checkable-list.component';
import {CheckableListItemComponent} from './checkable-list-item/checkable-list-item.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {CompletableListComponent} from './completable-list/completable-list.component';
import {CompletableListItemComponent} from './completable-list-item/completable-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    CheckableListComponent,
    CheckableListItemComponent,
    CompletableListComponent,
    CompletableListItemComponent
  ],
  exports: [
    CheckableListComponent,
    CompletableListComponent
  ]
})
export class CheckableListModule {
}
