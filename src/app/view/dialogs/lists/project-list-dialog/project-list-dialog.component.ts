import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {ProjectDialogComponent} from '../../entities/project-dialog/project-dialog.component';
import {FilterService} from '../../../../services/filter.service';
import {ProjectService} from '../../../../services/entities/project.service';

@Component({
  selector: 'app-project-list-dialog',
  templateUrl: './project-list-dialog.component.html',
  styleUrls: ['./project-list-dialog.component.scss']
})
export class ProjectListDialogComponent implements OnInit {

  dialogTitle = '';

  constructor(private projectService: ProjectService,
              private filterService: FilterService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
  }

  ngOnInit() {
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'add-project': {
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add project',
            project: new Project('', true)
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const project = result as Project;
            this.filterService.updateProjectsList([project], true);
            this.projectService.createProject(project);
          }
        });
        break;
      }
    }
  }

}
