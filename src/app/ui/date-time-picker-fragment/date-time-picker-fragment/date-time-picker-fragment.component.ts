import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateService} from 'app/core/entity/services/date.service';

/**
 * Displays time picker dialog
 */
@Component({
  selector: 'app-date-time-picker-fragment',
  templateUrl: './date-time-picker-fragment.component.html',
  styleUrls: ['./date-time-picker-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerFragmentComponent implements OnInit {

  /** Initial date to be displayed */
  @Input() date: Date;

  /** Event emitter indicating changes in date */
  @Output() dateChangedEmitter = new EventEmitter<Date>();

  /** Date */
  day = new Date();
  /** Hour */
  hour = 0;
  /** Minute */
  minute = 0;

  /** Array of selectable hours */
  hours = [];
  /** Array of selectable minutes */
  minutes = [];

  /** Reference to static method */
  addTrailingZero = DateTimePickerFragmentComponent.addTrailingZero;

  /**
   * Adds a trailing zero to one-digit numbers
   * @param value
   */
  static addTrailingZero(value: number) {
    if (value < 10) {
      return `0${value}`;
    }

    return value;
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeComponents();
    this.initializeOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes components
   */
  private initializeComponents() {
    if (this.date != null) {
      this.day = JSON.parse(JSON.stringify(this.date));
      this.hour = new Date(this.date).getHours();
      this.minute = DateService.getRoundedMinutes(new Date(this.date).getMinutes());
    }
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m = m + DateService.MINUTES_INTERVAL) {
      this.minutes.push(m);
    }
  }

  //
  // Actions
  //

  /**
   * Handles date changes
   * @param value date value
   */
  onDateChanged(value: Date) {
    this.date = new Date(
      new Date(value).getFullYear(),
      new Date(value).getMonth(),
      new Date(value).getDate(),
      this.hour,
      this.minute);

    this.initializeComponents();
    this.notify();
  }

  /**
   * Handles hour changes
   * @param {number} value hour value
   */
  onHourSelected(value: number) {
    if (this.date == null) {
      this.date = new Date();
    }

    this.date = new Date(
      new Date(this.date).getFullYear(),
      new Date(this.date).getMonth(),
      new Date(this.date).getDate(),
      value,
      new Date(this.date).getMinutes());

    this.initializeComponents();
    this.notify();
  }

  /**
   * Handles minute changes
   * @param {number} value minute value
   */
  onMinuteSelected(value: number) {
    if (this.date == null) {
      this.date = new Date();
    }

    this.date = new Date(
      new Date(this.date).getFullYear(),
      new Date(this.date).getMonth(),
      new Date(this.date).getDate(),
      new Date(this.date).getHours(),
      value
    );

    this.initializeComponents();
    this.notify();
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.dateChangedEmitter.emit(this.date);
  }
}
