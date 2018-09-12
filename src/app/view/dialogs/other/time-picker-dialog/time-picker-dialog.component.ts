import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {Action} from '../../../../model/ui/action.enum';

/**
 * Displays time picker
 */
@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Tasklet whose time shall be displayed */
  tasklet: Tasklet;

  /**
   * Constructor
   * @param {MatDialogRef<TimePickerDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<TimePickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
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
    this.tasklet = this.data.tasklet;
  }

  //
  // Actions
  //

  /**
   * Handles date changes
   * @param {Date} value date inputFieldValue
   */
  onDateChanged(value: Date) {
    this.tasklet.creationDate = value;
  }

  //
  // Button actions
  //

  /**
   * Handles click on update button
   */
  updateCreationTime() {
    this.dialogRef.close({action: Action.UPDATE, tasklet: this.tasklet});
  }
}
