import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Displays pomodoro finished dialog
 */
@Component({
  selector: 'app-pomodoro-finished-dialog',
  templateUrl: './pomodoro-finished-dialog.component.html',
  styleUrls: ['./pomodoro-finished-dialog.component.scss'],
})
export class PomodoroFinishedDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Text to be displayed */
  text = '';
  /** Action */
  action = '';
  /** Value to be returned */
  value: any;

  /** Checkbox state */
  disabled = false;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<PomodoroFinishedDialogComponent>,
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
    this.dialogTitle = this.data.title;
    this.text = this.data.text;
    this.action = this.data.action;
    this.value = this.data.value;
  }

  //
  // Actions
  //

  /**
   * Handles activation of checkbox
   */
  onCheckboxActived() {
    setInterval(() => {
      this.disabled = true;
    }, 1500);
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  confirm() {
    this.dialogRef.close(this.value);
  }
}
