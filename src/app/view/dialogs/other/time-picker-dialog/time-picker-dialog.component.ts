import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent implements OnInit {
  dialogTitle = '';
  tasklet: Tasklet;

  constructor(public dialogRef: MatDialogRef<TimePickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
    this.tasklet = this.data.tasklet;
  }

  ngOnInit() {
  }

  updateCreationTime() {
    this.dialogRef.close(this.tasklet);
  }

  onDateChanged(value: Date) {
    this.tasklet.creationDate = value;
  }
}
