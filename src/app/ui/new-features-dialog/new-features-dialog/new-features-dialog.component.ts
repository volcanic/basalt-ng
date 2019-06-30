import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Displays new features dialog
 */
@Component({
  selector: 'app-new-features-dialog',
  templateUrl: './new-features-dialog.component.html',
  styleUrls: ['./new-features-dialog.component.scss']
})
export class NewFeaturesDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';
  /** Array of git tags */
  gitTags = [];

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<NewFeaturesDialogComponent>,
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
    this.gitTags = this.data.gitTags;

    if (this.gitTags != null) {
      this.gitTags.forEach(gt => {
        gt.annotation = gt.annotation.replace(/.*v/g, '');
      });
    }
  }
}
