import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateService} from '../../../services/date.service';

@Component({
  selector: 'app-date-time-picker-fragment',
  templateUrl: './date-time-picker-fragment.component.html',
  styleUrls: ['./date-time-picker-fragment.component.scss']
})
export class DateTimePickerFragmentComponent implements OnInit {

  @Input() date: Date;
  @Input() disabled = false;
  @Output() dateChangedEmitter = new EventEmitter<Date>();

  hour = 0;
  minute = 0;

  hours = [];
  minutes = [];

  constructor(private dateService: DateService) {
  }

  ngOnInit() {
    if (this.date != null) {
      this.hour = new Date(this.date).getHours();
      this.minute = this.dateService.getRoundedMinutes(new Date(this.date).getMinutes());
    }

    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m = m + DateService.MINUTES_INTERVAL) {
      this.minutes.push(m);
    }
  }

  onDateChanged(value: Date) {
    this.date = value;
    this.notify();
  }

  onHourSelected(value: number) {
    this.date = new Date(
      new Date(this.date).getFullYear(),
      new Date(this.date).getMonth(),
      new Date(this.date).getDate(),
      value,
      new Date(this.date).getMinutes());

    this.notify();
  }


  onMinuteSelected(value: number) {
    this.date = new Date(
      new Date(this.date).getFullYear(),
      new Date(this.date).getMonth(),
      new Date(this.date).getDate(),
      new Date(this.date).getHours(),
      value
    );

    this.notify();
  }

  addTrailingZero(value: number) {
    if (value < 10) {
      return `0${value}`;
    }

    return value;
  }

  private notify() {
    this.dateChangedEmitter.emit(this.date);
  }
}
