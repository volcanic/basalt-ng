import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {ProjectDialogComponent} from '../../entities/project-dialog/project-dialog.component';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {ProjectService} from '../../../../services/entities/project.service';

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
   * @param {ProjectService} projectService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   * @param data dialog data
   */
  constructor(private projectService: ProjectService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog,
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

  /**
   * Handles project upserts
   * @param {Project} project project to be upserted
   */
  onUpsertProject(project: Project) {
    // Determine mode
    const mode = (project != null) ? DialogMode.UPDATE : DialogMode.ADD;

    // Assemble data to be passed
    let data = {};
    switch (mode) {
      case DialogMode.ADD: {
        data = {
          mode: mode,
          dialogTitle: 'Add project',
          project: new Project('')
        };
        break;
      }
      case DialogMode.UPDATE: {
        data = {
          mode: mode,
          dialogTitle: 'Update project',
          project: project
        };
        break;
      }
    }

    // Open dialog
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      disableClose: false,
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const resultingProject = result as Project;
        this.filterService.updateProjectsList([resultingProject], true);

        switch (mode) {
          case DialogMode.ADD: {
            this.projectService.createProject(resultingProject).then(() => {
            });
            break;
          }
          case DialogMode.UPDATE: {
            this.projectService.updateProject(resultingProject, true).then(() => {
            });
            break;
          }
        }
      }
    });
  }
}
