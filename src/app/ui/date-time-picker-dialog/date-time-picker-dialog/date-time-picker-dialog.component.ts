import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Action} from '../../../core/entity/model/action.enum';

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

  /**
   * Constructor
   * @param {MatDialogRef<DateTimePickerDialogComponent>} dialogRef dialog reference
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
  }

  //
  // Actions
  //

  /**
   * Handles date changes
   * @param {Date} value date value
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
    this.dialogRef.close({action: Action.UPDATE, date: this.date});
  }
}
