import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {DateService} from '../../../../services/date.service';
import {DomSanitizer} from '@angular/platform-browser';

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

  hour = 0;
  minute = 0;
  hours = [];
  minutes = [];

  constructor(private adapter: DateAdapter<any>,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('timer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_black_24px.svg'));
  }

  ngOnInit() {
    this.adapter.setLocale('en-GB');

    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.task = JSON.parse(this.data.task);
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

  addTask() {
    this.dialogRef.close(this.task);
  }

  updateTask() {
    this.dialogRef.close(this.task);
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
