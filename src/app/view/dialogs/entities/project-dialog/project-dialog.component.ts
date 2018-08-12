import {Component, Inject, OnInit} from '@angular/core';
import {Project} from '../../../../model/entities/project.model';
import {Task} from '../../../../model/entities/task.model';
import {DateService} from '../../../../services/util/date.service';
import {DIALOG_MODE} from '../../../../model/ui/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {TaskService} from '../../../../services/entities/task.service';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {ProjectService} from '../../../../services/entities/project.service';
import {InformationDialogComponent} from '../../other/information-dialog/information-dialog.component';
import {CloneService} from '../../../../services/util/clone.service';
import {FilterService} from '../../../../services/entities/filter/filter.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {

  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  project: Project;

  inputDisabled = false;

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private dateService: DateService,
              private filterService: FilterService,
              private cloneService: CloneService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;

    // Deep copy
    this.project = this.cloneService.cloneProject(this.data.project);
  }

  //
  // Action
  //

  public onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.updateProject();
    }
  }

  //
  // Buttons action
  //

  addProject() {
    this.dialogRef.close(this.project);
  }

  updateProject() {
    this.dialogRef.close(this.project);
  }

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
