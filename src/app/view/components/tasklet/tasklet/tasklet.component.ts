import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {SnackbarService} from '../../../../services/snackbar.service';
import {TaskletDialogComponent} from '../../../dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../../dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {DateService} from '../../../../services/date.service';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {Tag} from '../../../../model/tag.model';
import {TimePickerDialogComponent} from '../../../dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {UUID} from '../../../../model/util/uuid';
import {TASKLET_TYPE} from '../../../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../../../model/tasklet-daily-scrum.model';
import {Project} from '../../../../model/entities/project.model';
import {EntityService} from '../../../../services/entities/entity.service';
import {ProjectService} from '../../../../services/entities/project.service';

@Component({
  selector: 'app-tasklet',
  templateUrl: './tasklet.component.html',
  styles: [require('./tasklet.component.scss')]
})
export class TaskletComponent implements OnInit {
  @Input() tasklet: Tasklet;

  tags: Tag[] = [];
  projects: Project[] = [];

  time = '';
  date = '';

  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private taskletService: TaskletService,
              private snackbarService: SnackbarService,
              private dateService: DateService,
              public dialog: MatDialog) {

  }

  ngOnInit() {
    this.tags = Array.from(this.taskletService.getTags().values());
    this.tags.forEach(t => {
      if (this.tasklet.tags != null) {
        t.checked = false;

        this.tasklet.tags.forEach(tt => {
          if (t.name === tt.name) {
            t.checked = true;
          }
        });
      }
    });

    this.projects = Array.from(this.projectService.projects.values());

    this.time = this.dateService.getTime(new Date(this.tasklet.creationDate));
    this.date = this.dateService.getDate(new Date(this.tasklet.creationDate));
  }

  onActionFired(action: string) {
    switch (action) {
      case 'update': {
        this.updateTasklet();
        break;
      }
      case 'updateTime': {
        this.updateTaskletTime();
        break;
      }
      case 'continue': {
        this.continueTasklet();
        break;
      }
      case 'template': {
        this.templateTasklet();
        break;
      }
      case 'save': {
        this.taskletService.updateTasklet(this.tasklet);
        break;
      }
    }
  }

  private updateTasklet() {
    const dialogRef = this.dialog.open(TaskletDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update tasklet',
        tasklet: this.tasklet,
        tags: this.tags.map(tag => {
          if (this.tasklet.tags != null) {
            this.tasklet.tags.forEach(t => {
              if (tag.name === t.name) {
                return (new Tag(tag.name, true));
              }
            });

            return (new Tag(tag.name, false));
          }
        }),
        projects: this.projects
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Continued tasklet', '');
      }
    });
  }

  private continueTasklet() {
    const continueTasklet = JSON.parse(JSON.stringify(this.tasklet));
    continueTasklet._rev = null;
    continueTasklet.id = new UUID().toString();
    continueTasklet.text = '';
    continueTasklet.creationDate = new Date();
    continueTasklet.persons = [];

    if (this.tasklet.type === TASKLET_TYPE.IDEA) {
      continueTasklet.type = TASKLET_TYPE.ACTION;
    }

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: continueTasklet,
        tags: this.tags,
        projects: this.projects,
        previousText: this.tasklet.text
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.createTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Added tasklet', '');
      }
    });
  }

  private templateTasklet() {
    const template = JSON.parse(JSON.stringify(this.tasklet));
    template._rev = null;
    template.id = new UUID().toString();
    template.text = '';
    template.creationDate = new Date();
    template.participants.forEach(p => {
        p.activities = [];
      }
    );

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: template,
        tags: this.tags,
        projects: this.projects
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.createTasklet(result as TaskletDailyScrum);
        this.snackbarService.showSnackbar('Added tasklet', '');
      }
    });
  }

  private updateTaskletTime() {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {
        dialogTitle: 'Set creation time',
        tasklet: this.tasklet
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Updated tasklet creation time', '');
      }
    });
  }

  public deleteTasklet() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {
        title: 'Delete tasklet',
        text: 'Do you want to delete this tasklet?',
        action: 'Delete',
        value: this.tasklet
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.deleteTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Deleted tasklet', '');
      }
    });
  }
}
