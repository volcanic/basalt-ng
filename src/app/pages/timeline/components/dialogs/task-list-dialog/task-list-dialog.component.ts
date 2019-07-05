import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TaskDialogComponent} from '../task-dialog/task-dialog.component';
import {Task} from 'app/core/entity/model/task.model';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays task list dialog
 */
@Component({
  selector: 'app-task-list-dialog',
  templateUrl: './task-list-dialog.component.html',
  styleUrls: ['./task-list-dialog.component.scss']
})
export class TaskListDialogComponent {

  /** Dialog title */
  dialogTitle = '';
  /** Array of tasks to be displayed */
  tasks = [];

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.tasks = this.data.tasks;
  }

  //
  // Actions
  //

  /**
   * Handles task events
   * @param event event
   */
  onTaskEvent(event: { action: Action, task: Task }) {
    this.dialogRef.close(event);
  }
}
