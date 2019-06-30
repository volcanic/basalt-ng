import {Component, Inject, OnInit} from '@angular/core';
import {Project} from 'app/core/entity/model/project.model';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Action} from 'app/core/entity/model/action.enum';

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
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
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
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.project = this.data.project;
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      switch (this.mode) {
        case DialogMode.ADD: {
          this.addProject();
          break;
        }
        case DialogMode.UPDATE: {
          this.updateProject();
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
  addProject() {
    this.dialogRef.close({action: Action.ADD, project: this.project});
  }

  /**
   * Handles click on update button
   */
  updateProject() {
    this.dialogRef.close({action: Action.UPDATE, project: this.project});
  }

  /**
   * Handles click on delete button
   */
  deleteProject() {
    this.dialogRef.close({action: Action.DELETE, project: this.project});
  }
}
