import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {CalendarGridComponent} from './components/calendar-grid/calendar-grid.component';
import {CalendarGridDayComponent} from './components/calendar-grid-day/calendar-grid-day.component';
import {CalendarGridQuarterHourComponent} from './components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component';
import {CalendarItemComponent} from './components/calendar-item/calendar-item.component';
import {MaterialModule} from '../../ui/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    CalendarComponent,
    CalendarGridComponent,
    CalendarGridDayComponent,
    CalendarGridQuarterHourComponent,
    CalendarItemComponent,
  ], exports: [
    CalendarComponent
  ]
})
/**
 * Contains calendar page
 */
export class CalendarModule {
}
