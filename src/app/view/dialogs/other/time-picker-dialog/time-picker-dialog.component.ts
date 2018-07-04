import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef} from '@angular/material';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {DateService} from '../../../../services/date.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent implements OnInit {
  dialogTitle = '';
  tasklet: Tasklet;

  year = 2000;
  month = 1;
  day = 1;

  hour = 0;
  minute = 0;
  hours = [];
  minutes = [];

  calendarDate = new Date(this.year, this.month, this.day);

  constructor(private adapter: DateAdapter<any>,
              public dialogRef: MatDialogRef<TimePickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
    this.tasklet = this.data.tasklet;
  }

  ngOnInit() {
    this.adapter.setLocale('en-GB');

    this.year = new Date(this.tasklet.creationDate).getFullYear();
    this.month = new Date(this.tasklet.creationDate).getMonth();
    this.day = new Date(this.tasklet.creationDate).getDate();

    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m = m + DateService.MINUTES_INTERVAL) {
      this.minutes.push(m);
    }

    this.hour = new Date(this.tasklet.creationDate).getHours();
    this.minute = new Date(this.tasklet.creationDate).getMinutes();

    this.calendarDate = new Date(this.year, this.month, this.day);
  }

  onHourSelected(value: number) {
    const creationDate = new Date(this.tasklet.creationDate);
    this.tasklet.creationDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth(), this.calendarDate.getDate(),
      value, creationDate.getMinutes());
  }

  onMinuteSelected(value: number) {
    const creationDate = new Date(this.tasklet.creationDate);
    this.tasklet.creationDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth(), this.calendarDate.getDate(), creationDate.getHours(), value);
  }

  onDateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    const creationDate = new Date(this.tasklet.creationDate);
    this.tasklet.creationDate = new Date(event.value.getFullYear(),
      event.value.getMonth(),
      event.value.getDate(),
      creationDate.getHours(),
      creationDate.getMinutes());
  }

  updateCreationTime() {
    this.dialogRef.close(this.tasklet);
  }

  addTrailingZero(value: number) {
    if (value < 10) {
      return `0${value}`;
    }

    return value;
  }
}
