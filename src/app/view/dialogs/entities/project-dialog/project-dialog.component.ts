import {Component, Inject, OnInit} from '@angular/core';
import {Project} from '../../../../model/entities/project.model';
import {Task} from '../../../../model/entities/task.model';
import {DateService} from '../../../../services/util/date.service';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {TaskService} from '../../../../services/entities/task.service';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {ProjectService} from '../../../../services/entities/project.service';
import {InformationDialogComponent} from '../../other/information-dialog/information-dialog.component';
import {CloneService} from '../../../../services/util/clone.service';
import {FilterService} from '../../../../services/entities/filter/filter.service';

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

  /** Person to be displayed */
  project: Project;

  /** Readonly dialog if true */
  readonly = false;

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {TaskService} taskService
   * @param {DateService} dateService
   * @param {FilterService} filterService
   * @param {CloneService} cloneService
   * @param {MatDialog} dialog dialog
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private dateService: DateService,
              private filterService: FilterService,
              private cloneService: CloneService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<ProjectDialogComponent>,
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
    this.initializeProject();
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
  }

  /**
   * Initializes project
   */
  private initializeProject() {
    this.project = CloneService.cloneProject(this.data.project);
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
    this.dialogRef.close(this.project);
  }

  /**
   * Handles click on update button
   */
  updateProject() {
    this.dialogRef.close(this.project);
  }

  /**
   * Handles click on delete button
   */
  deleteProject() {
    const references = Array.from(this.taskService.tasks.values()).filter((task: Task) => {
      return task.projectId === this.project.id;
    }).length;

    if (references > 0) {
      this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Cannot delete project',
          text: `There are still ${references} tasks associated with this project.`,
          action: 'Okay',
          value: this.project
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Delete project',
          text: 'Do you want to delete this project?',
          action: 'Delete',
          value: this.project
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.projectService.deleteProject(result as Project);
          this.filterService.projects.delete((result as Project).id); // Delete project from filter list
          this.dialogRef.close(null);
        }
      });
    }
  }
}
