import {NgModule} from '@angular/core';
import {CheckableListComponent} from './checkable-list/checkable-list.component';
import {CompletableListComponent} from './completable-list/completable-list.component';
import {CheckableListDeclarations} from './checkable-list.declaration';
import {CheckableListImports} from './checkable-list.imports';

@NgModule({
  imports: [CheckableListImports],
  declarations: [CheckableListDeclarations],
  exports: [
    CheckableListComponent,
    CompletableListComponent
  ]
})
export class CheckableListModule {
}
