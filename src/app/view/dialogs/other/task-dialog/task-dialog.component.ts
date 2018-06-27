import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {DateService} from '../../../../services/date.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  task: Task;

  // Due date
  hour = 0;
  minute = 0;
  hours = [];
  minutes = [];

  // Priority
  colorEmpty = '#cfd8dc';
  colorsPriorities = [
    '#90a4ae',
    '#78909c',
    '#607d8b',
    '#546e7a',
    '#455a64',
  ];
  colorsFlags = [
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc'
  ];

  constructor(private adapter: DateAdapter<any>,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.adapter.setLocale('en-GB');

    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.task = JSON.parse(this.data.task);

    this.initializeDueDate();
    this.initializePriority();
  }

  initializeDueDate() {
    if (this.task.dueDate == null) {
      this.task.dueDate = new Date();
    }
    this.hour = new Date(this.task.dueDate).getHours();
    this.minute = new Date(this.task.dueDate).getMinutes();

    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m = m + DateService.MINUTES_INTERVAL) {
      this.minutes.push(m);
    }

    this.hour = new Date(this.task.dueDate).getHours();
    this.minute = new Date(this.task.dueDate).getMinutes();
  }

  initializePriority() {
    this.colorsFlags.forEach((flagColor, index) => {
      if (index <= this.task.priority) {
        this.colorsFlags[index] = this.colorsPriorities[this.task.priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  addTask() {
    this.dialogRef.close(this.task);
  }

  updateTask() {
    this.dialogRef.close(this.task);
  }

  onHoverFlag(priority: number) {
    this.colorsFlags.forEach((flagColor, index) => {
      if (index <= priority) {
        this.colorsFlags[index] = this.colorsPriorities[priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  onLeaveFlag() {
    this.initializePriority();
  }

  onClickFlag(priority: number) {
    this.task.priority = priority;
  }

  onHourSelected(value: number) {
    this.task.dueDate = new Date(this.task.dueDate.getFullYear(), this.task.dueDate.getMonth(), this.task.dueDate.getDate(), value, this.task.dueDate.getMinutes());
  }

  onMinuteSelected(value: number) {
    this.task.dueDate = new Date(this.task.dueDate.getFullYear(), this.task.dueDate.getMonth(), this.task.dueDate.getDate(), this.task.dueDate.getHours(), value);
  }

  addTrailingZero(value: number) {
    if (value < 10) {
      return `0${value}`;
    }

    return value;
  }
}
