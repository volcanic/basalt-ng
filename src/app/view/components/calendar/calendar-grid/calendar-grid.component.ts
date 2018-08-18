import {Component, Input, OnInit} from '@angular/core';

/**
 * Displays calender grid
 */
@Component({
  selector: 'app-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.scss']
})
export class CalendarGridComponent {

  /** Focus day to be displayed */
  @Input() focusDay = new Date();
}
