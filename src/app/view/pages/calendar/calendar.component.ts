import {Component, OnInit} from '@angular/core';

/**
 * Displays calendar page
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  /** Focus day to be displayed */
  focusDay = new Date();
}
