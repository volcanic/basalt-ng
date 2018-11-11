import {Component, Input, OnInit} from '@angular/core';
import {DateService} from '../../../../../../core/entity/services/date.service';

/**
 * Displays a time/date with regards to current date
 * (e.g. day and month will be replaced by weekday if date is in the current week)
 */
@Component({
  selector: 'app-relative-time-fragment',
  templateUrl: './relative-time-fragment.component.html',
  styleUrls: ['./relative-time-fragment.component.scss']
})
export class RelativeTimeFragmentComponent implements OnInit {

  /** Date to be displayed */
  @Input() date: Date;

  /** Creation time */
  time = '';
  /** Creation weekday */
  weekday = '';
  /** Creation date */
  fullDate = '';
  /** Simple creation date */
  simpleDate = '';

  /** Reference to static service methods */
  isToday = DateService.isToday;
  /** Reference to static service methods */
  isBeforeNow = DateService.isBeforeNow;
  /** Reference to static service methods */
  isBeforeToday = DateService.isBeforeToday;
  /** Reference to static service methods */
  isWithinNextDays = DateService.isWithinNextDays;
  /** Reference to static service methods */
  isInCurrentWeek = DateService.isInCurrentWeek;

  //
  // Lifecycle hooks
  //

  /**
   * Initializes on-init lifecycle phase
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
    this.time = DateService.getTimeString(new Date(this.date));
    this.weekday = DateService.getWeekDayString(new Date(this.date).getDay());
    this.fullDate = DateService.getDateString(new Date(this.date));
    this.simpleDate = DateService.getSimpleDateWithoutYearString(new Date(this.date));
  }
}
