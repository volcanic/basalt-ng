import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Project} from '../../../model/entities/project.model';
import {ProjectDialogComponent} from '../../dialogs/entities/project-dialog/project-dialog.component';
import {DialogMode} from '../../../model/ui/dialog-mode.enum';
import {ProjectService} from '../../../services/entities/project.service';
import {MatDialog} from '@angular/material';
import {FilterService} from '../../../services/entities/filter/filter.service';

/**
 * Displays project list item
 */
@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent {

  /** Project to be displayed */
  @Input() project: Project;

  /** Animation state */
  state = 'inactive';

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   */
  constructor(private projectService: ProjectService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog) {
  }

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  //
  // Button actions
  //

  /**
   * Handles click on update button
   */
  updateProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      disableClose: false,
      data: {
        mode: DialogMode.UPDATE,
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
