import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Task} from '../../../../model/entities/task.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';

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

  constructor(public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.task = JSON.parse(this.data.task);
  }

  addTask() {
    this.dialogRef.close(this.task);
  }

  updateTask() {
    this.dialogRef.close(this.task);
  }
}
