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
    this.dialogTitle = data.dialogTitle;
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'add-project': {
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data: {
            mode: DialogMode.ADD,
            dialogTitle: 'Add project',
            project: new Project('', true)
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const project = result as Project;
            this.filterService.updateProjectsList([project], true);
            this.projectService.createProject(project).then(() => {
              this.changeDetector.markForCheck();
            });
          }
        });
        break;
      }
    }
  }
}
