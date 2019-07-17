import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from 'app/core/entity/model/project.model';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays project list dialog
 */
@Component({
  selector: 'app-project-list-dialog',
  templateUrl: './project-list-dialog.component.html',
  styleUrls: ['./project-list-dialog.component.scss']
})
export class ProjectListDialogComponent {

  /** Dialog title */
  dialogTitle = '';
  /** Map of projects */
  projectsMap = new Map<string, Project>();

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
    this.projectsMap = this.data.projectsMap;
  }

  //
  // Actions
  //

  /**
   * Handles project events
   * @param event project event
   */
  onProjectEvent(event: { action: Action, project: Project }) {
    this.dialogRef.close(event);
  }
}
