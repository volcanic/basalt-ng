import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {CloneService} from '../../../../services/util/clone.service';

/**
 * Displays project filter dialog
 */
@Component({
  selector: 'app-project-filter-dialog',
  templateUrl: './project-filter-dialog.component.html',
  styleUrls: ['./project-filter-dialog.component.scss'],
})
export class ProjectFilterDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Projects to be displayed */
  projects: Project[] = [];

  /** Flag indicating whether entities without project shall be displayed */
  projectsNone = false;

  /**
   * Constructor
   * @param {MatDialogRef<ProjectFilterDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ProjectFilterDialogComponent>,
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
    this.projects = CloneService.cloneProjects(this.data.projects).sort((p1, p2) => {
      return p1.name > p2.name ? 1 : -1;
    });
    this.projectsNone = this.data.projectsNone;
  }

  //
  // Button actions
  //

  /**
   * Handles click on select-all button
   */
  selectAll() {
    this.projects.forEach(p => {
      p.checked = true;
    });
    this.projectsNone = true;
  }

  /**
   * Handles click on select-none button
   */
  selectNone() {
    this.projects.forEach(p => {
      p.checked = false;
    });
    this.projectsNone = false;
  }

  /**
   * Handles click on apply button
   */
  apply() {
    this.dialogRef.close({projects: this.projects, projectsNone: this.projectsNone});
  }
}
