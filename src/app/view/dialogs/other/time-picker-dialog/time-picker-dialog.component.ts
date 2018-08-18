import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from '../../../../model/entities/tasklet.model';

/**
 * Displays time picker
 */
@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent {

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
    this.dialogTitle = data.dialogTitle;
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
    this.dialogRef.close(this.tasklet);
  }
}
