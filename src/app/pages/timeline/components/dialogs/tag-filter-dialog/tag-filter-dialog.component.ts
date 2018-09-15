import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Displays tag filter dialog
 */
@Component({
  selector: 'app-tag-filter-dialog',
  templateUrl: './tag-filter-dialog.component.html',
  styleUrls: ['./tag-filter-dialog.component.scss'],
})
export class TagFilterDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Tags to be displayed */
  tags = [];
  /** Flag indicating whether entities without tag shall be displayed */
  tagsNone = false;

  /**
   * Constructor
   * @param {MatDialogRef<TagFilterDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<TagFilterDialogComponent>,
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
    this.tags = this.data.tags.sort((t1, t2) => {
      return t1.name > t2.name ? 1 : -1;
    });
    this.tagsNone = this.data.tagsNone;
  }

  //
  // Button actions
  //

  /**
   * Handles click on select-all button
   */
  selectAll() {
    this.tags.forEach(t => {
      t.checked = true;
    });
    this.tagsNone = true;
  }

  /**
   * Handles click on select-none button
   */
  selectNone() {
    this.tags.forEach(t => {
      t.checked = false;
    });
    this.tagsNone = false;
  }

  /**
   * Handles click on apply button
   */
  apply() {
    this.dialogRef.close({tags: this.tags, tagsNone: this.tagsNone});
  }
}
