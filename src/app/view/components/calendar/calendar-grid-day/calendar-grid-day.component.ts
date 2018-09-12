import {Component, Input, OnInit} from '@angular/core';
import {QuarterHour} from '../../../../model/ui/quarterhour.model';
import {DateService} from '../../../../services/util/date.service';

/**
 * Displays calendar grid for a day
 */
@Component({
  selector: 'app-calendar-grid-day',
  templateUrl: './calendar-grid-day.component.html',
  styleUrls: ['./calendar-grid-day.component.scss']
})
export class CalendarGridDayComponent implements OnInit {

  /** Focus day to be displayed */
  @Input() focusDay = new Date();
  /** Array of tasklet */
  @Input() tasklets = [];

  /** Weekday */
  weekDay = '';
  /** Date */
  date = '';
  /** Array of quarterhours */
  quarterHours = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeDate();
  }

  //
  // Initialization
  //

  /**
   * Initializes date
   */
  private initializeDate() {
    this.weekDay = DateService.getWeekDayString(this.focusDay.getDay());
    this.date = this.focusDay.getDate().toString();

    const dayStart = new Date(this.focusDay).setHours(0, 0, 0, 0);
    let counter = 0;
    while (counter < (24 * 4)) {
      const start = new Date(new Date(dayStart).getTime() + (counter * 15 * 60000));
      const end = new Date(new Date(dayStart).getTime() + ((counter + 1) * 15 * 60000));

      const quaterHour = new QuarterHour();
      quaterHour.start = start;
      quaterHour.end = end;

      this.quarterHours.push(quaterHour);
      counter++;
    }
  }
}
