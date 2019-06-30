import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tag} from '../../../../../core/entity/model/tag.model';

/**
 * Enhances tag by view model attributes
 */
class SelectableTag extends Tag {

  /** Selected in dialog if true */
  selected: boolean;
}

/**
 * Displays unused tags dialog
 */
@Component({
  selector: 'app-unused-tags-dialog',
  templateUrl: './unused-tags-dialog.component.html',
  styleUrls: ['./unused-tags-dialog.component.scss']
})
export class UnusedTagsDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Tags to be displayed */
  tags: SelectableTag[];
  /** Selected tags */
  tagsSelected: Tag[] = [];

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<UnusedTagsDialogComponent>,
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
    this.tags = this.data.tags;
  }

  //
  // Actions
  //

  /**
   * Handles selection of a tag
   * @param tag tag
   * @param event selection state
   */
  onTagSelected(tag: SelectableTag, event: any) {
    tag.selected = event.checked;
    this.tagsSelected = this.tags.filter(t => {
      return t.selected;
    });
  }

  /**
   * Handles click on delete button
   */
  onDeleteButtonClicked() {
    this.dialogRef.close({tags: this.tagsSelected});
  }
}
