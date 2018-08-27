import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {ProjectDialogComponent} from '../../entities/project-dialog/project-dialog.component';
import {Action} from '../../../../model/ui/action.enum';
import {Person} from '../../../../model/entities/person.model';

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
  /** Array of projects to be displayed */
  projects: Project[];

  /**
   * Constructor
   * @param {MatDialogRef<ProjectDialogComponent>} dialogRef
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initializeData();
  }

  //
  // Initialization
  //

  private initializeData() {
    this.dialogTitle = this.data.dialogTitle;
    this.projects = this.data.projects;
  }

  //
  // Actions
  //

  onUpsertProject(project: Project) {
    this.dialogRef.close({action: Action.NONE, value: project});
  }
}
