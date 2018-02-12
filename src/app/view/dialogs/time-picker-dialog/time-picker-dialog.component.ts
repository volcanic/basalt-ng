import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from '../../../model/tasklet.model';
import {DateService} from '../../../services/date.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent implements OnInit {
  dialogTitle = '';
  tasklet: Tasklet;

  hour = 0;
  minute = 0;
  hours = [];
  minutes = [];

  constructor(public dialogRef: MatDialogRef<TimePickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
    this.tasklet = this.data.tasklet;
  }

  ngOnInit() {
    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m = m + DateService.MINUTES_INTERVAL) {
      this.minutes.push(m);
    }

    this.hour = new Date(this.tasklet.creationDate).getHours();
    this.minute = new Date(this.tasklet.creationDate).getMinutes();
  }

  onHourSelected(value: number) {
    const creationDate = new Date(this.tasklet.creationDate);
    this.tasklet.creationDate = new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate(),
      value, creationDate.getMinutes());
  }

  onMinuteSelected(value: number) {
    const creationDate = new Date(this.tasklet.creationDate);
    this.tasklet.creationDate = new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate(),
      creationDate.getHours(), value);
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
