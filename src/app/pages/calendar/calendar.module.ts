import {NgModule} from '@angular/core';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {CalendarImports} from './calendar.imports';
import {CalendarDeclarations} from './calendar.declaration';

@NgModule({
  imports: [CalendarImports],
  declarations: [CalendarDeclarations],
  exports: [
    CalendarComponent
  ]
})
/**
 * Contains calendar page
 */
export class CalendarModule {
}
