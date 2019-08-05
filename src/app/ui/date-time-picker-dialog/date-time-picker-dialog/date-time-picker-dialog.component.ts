import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Action} from '../../../core/entity/model/action.enum';
import {Task} from '../../../core/entity/model/task.model';
import {Project} from '../../../core/entity/model/project.model';
import {Tasklet} from '../../../core/entity/model/tasklet.model';

/**
 * Displays time picker
 */
@Component({
  selector: 'app-time-picker',
  templateUrl: './date-time-picker-dialog.component.html',
  styleUrls: ['./date-time-picker-dialog.component.scss']
})
export class DateTimePickerDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Date that shall be displayed */
  date: Date;

  /** Temporarily displayed tasklet */
  tasklet: Tasklet;
  /** Temporarily displayed task */
  task: Task;
  /** Temporarily displayed project */
  project: Project;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<DateTimePickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.dialogTitle;
    this.date = this.data.date;
    this.tasklet = this.data.tasklet;
    this.task = this.data.task;
    this.project = this.data.project;
  }

  //
  // Actions
  //

  /**
   * Handles date changes
   * @param value date value
   */
  onDateChanged(value: Date) {
    this.date = value;
  }

  //
  // Button actions
  //

  /**
   * Handles click on update button
   */
  updateCreationTime() {
    this.dialogRef.close({
      action: Action.UPDATE,
      date: this.date,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project
    });
  }
}
