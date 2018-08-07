import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Project} from '../../../model/entities/project.model';
import {ProjectDialogComponent} from '../../dialogs/entities/project-dialog/project-dialog.component';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {ProjectService} from '../../../services/entities/project.service';
import {MatDialog} from '@angular/material';
import {FilterService} from '../../../services/filter.service';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent implements OnInit {
  @Input() project: Project;

  state = 'inactive';

  constructor(private projectService: ProjectService,
              private filterService: FilterService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  updateProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update project',
        project: this.project
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const project = result as Project;

        this.projectService.updateProject(project, true).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateProjectsList([project], true);
      }
    });
  }
}
