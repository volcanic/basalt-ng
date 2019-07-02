import {NgModule} from '@angular/core';
import {StartComponent} from './pages/start/start.component';
import {StartImports} from './start.imports';
import {CalendarDeclarations} from './start.declaration';

@NgModule({
  imports: [StartImports],
  declarations: [CalendarDeclarations],
  entryComponents: [
    StartComponent
  ], exports: [
    StartComponent
  ]
})
export class StartModule {
}
