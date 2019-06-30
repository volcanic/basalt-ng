import {Component, Inject} from '@angular/core';
import {Tag} from 'app/core/entity/model/tag.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Action} from 'app/core/entity/model/action.enum';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';

/**
 * Displays tag list dialog
 */
@Component({
  selector: 'app-tag-list-dialog',
  templateUrl: './tag-list-dialog.component.html',
  styleUrls: ['./tag-list-dialog.component.scss']
})
export class TagListDialogComponent {

  /** Dialog title */
  dialogTitle = '';
  /** Array of tags to be displayed */
  tags: Tag[];

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
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
    this.tags = this.data.tags;
  }

  //
  // Actions
  //

  /**
   * Handles tag events
   * @param event event
   */
  onTagEvent(event: { action: Action, tag: Tag }) {
    this.dialogRef.close(event);
  }
}

