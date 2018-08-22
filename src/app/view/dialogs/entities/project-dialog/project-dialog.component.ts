import {Component, Inject, OnInit} from '@angular/core';
import {Project} from '../../../../model/entities/project.model';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {DialogAction} from '../../../../model/ui/dialog-action.enum';

/**
 * Displays project dialog
 */
@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Project to be displayed */
  project: Project;

  /** Readonly dialog if true */
  readonly = false;

  /**
   * Constructor
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
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
    this.project = this.data.project;
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
      this.updateProject();
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addProject() {
    this.dialogRef.close({action: DialogAction.ADD, value: this.project});
  }

  /**
   * Handles click on update button
   */
  updateProject() {
    this.dialogRef.close({action: DialogAction.UPDATE, value: this.project});
  }

  /**
   * Handles click on delete button
   */
  deleteProject() {
    this.dialogRef.close({action: DialogAction.DELETE, value: this.project});
  }
}
