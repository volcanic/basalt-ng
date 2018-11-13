import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Displays about dialog
 */
@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** App name */
  name = '';
  /** App version */
  version = '';
  /** App license */
  license = '';
  /** App homepage */
  homepage = '';

  /**
   * Constructor
   * @param {MatDialogRef<PomodoroFinishedDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<AboutDialogComponent>,
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
    this.name = this.data.name;
    this.version = this.data.version;
    this.license = this.data.license;
    this.homepage = this.data.homepage;
  }
}
