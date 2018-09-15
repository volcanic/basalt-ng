import {Component, Inject, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from 'app/ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {Tag} from 'app/core/entity/model/tag.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays tag dialog
 */
@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Tag to be displayed */
  tag: Tag;

  /** Readonly dialog if true */
  readonly = false;

  /**
   * Constructor
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<TagDialogComponent>,
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
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.tag = this.data.tag;
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      switch (this.mode) {
        case DialogMode.ADD: {
          this.addTag();
          break;
        }
        case DialogMode.UPDATE: {
          this.updateTag();
          break;
        }
      }
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addTag() {
    this.dialogRef.close({action: Action.ADD, tag: this.tag});
  }

  /**
   * Handles click on update button
   */
  updateTag() {
    this.dialogRef.close({action: Action.UPDATE, tag: this.tag});
  }

  /**
   * Handles click on delete button
   */
  deleteTag() {
    this.dialogRef.close({action: Action.DELETE, tag: this.tag});
  }
}
