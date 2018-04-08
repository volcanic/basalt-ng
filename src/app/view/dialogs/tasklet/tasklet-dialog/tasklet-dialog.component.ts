import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {UUID} from '../../../../model/util/uuid';
import {Tasklet} from '../../../../model/tasklet.model';
import {TaskletsService} from '../../../../services/tasklets.service';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {TASKLET_TYPE} from '../../../../model/tasklet-type.enum';
import {TaskletTodo} from '../../../../model/tasklet-todo.model';
import {Tag} from '../../../../model/tag.model';
import {TaskletDailyScrum} from '../../../../model/tasklet-daily-scrum.model';
import {ProjectDialogComponent} from '../../filters/project-dialog/project-dialog.component';
import {Project} from '../../../../model/project.model';

@Component({
  selector: 'app-tasklet-dialog',
  templateUrl: './tasklet-dialog.component.html',
  styles: [require('./tasklet-dialog.component.scss')],
})
export class TaskletDialogComponent implements OnInit {
  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  tasklet: Tasklet;
  previousText = '';

  taskOptions = [];

  projects: Project[] = [];
  tags: Tag[] = [];
  newTags: Tag[] = [];

  iconAdd = 'add';

  constructor(private taskletsService: TaskletsService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskletDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_black_24px.svg'));
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.tasklet = JSON.parse(JSON.stringify(this.data.tasklet));
    this.tags = JSON.parse(JSON.stringify(this.data.tags)).sort((t1, t2) => {
      return t1.value > t2.value ? 1 : -1;
    }).map(t => {
      if (this.tasklet.tags != null) {
        t.checked = false;

        this.tasklet.tags.forEach(tt => {
          if (t.value === tt.value) {
            t.checked = true;
          }
        });
      }

      return t;
    });
    this.projects = this.data.projects;
    this.previousText = this.data.previousText;

    this.taskOptions = this.taskletsService.getTasks();

    this.newTags.push(new Tag('', false));
  }

  onDueHourSelected(value: number) {
    const taskletTodo = this.tasklet as TaskletTodo;
    const dueDate = new Date(taskletTodo.dueDate);

    taskletTodo.dueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate(), value, dueDate.getMinutes());
  }

  onDueMinuteSelected(value: number) {
    const taskletTodo = this.tasklet as TaskletTodo;
    const dueDate = new Date(taskletTodo.dueDate);

    taskletTodo.dueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate(), dueDate.getHours(), value);
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.ADD,
        dialogTitle: 'Add project',
        project: ''
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.tasklet.project = result;
        this.projects.unshift(result);
      }
    });
  }

  addTasklet() {
    this.tasklet.id = new UUID().toString();
    this.tasklet.creationDate = new Date();
    this.tasklet.tags = [];
    this.tags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.tasklet.tags.push(t);
      }
    );

    switch (this.tasklet.type) {
      case TASKLET_TYPE.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      case TASKLET_TYPE.TODO: {
        this.dialogRef.close(this.tasklet as TaskletTodo);
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK:
      case TASKLET_TYPE.FINISHING_TIME: {
        this.tasklet.taskName = this.tasklet.type;
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet);
      }
    }
  }

  updateTasklet() {
    this.tasklet.tags = [];
    this.tags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.tasklet.tags.push(t);
      }
    );

    switch (this.tasklet.type) {
      case TASKLET_TYPE.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      case TASKLET_TYPE.TODO: {
        this.dialogRef.close(this.tasklet as TaskletTodo);
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK:
      case TASKLET_TYPE.FINISHING_TIME: {
        this.tasklet.taskName = this.tasklet.type;
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
    }
  }

  updateTaskletDailyScrum(tasklet: TaskletDailyScrum) {
    tasklet.taskName = tasklet.type;
    tasklet.participants = tasklet.participants.filter(p => {
      return p.person != null && p.person.name.length > 0;
    });
    tasklet.participants.forEach(p => {
      p.activities = p.activities.filter(a => {
        return a.topic.length > 0;
      });
    });
    this.dialogRef.close(this.tasklet);
  }

  continueTasklet() {
    this.tasklet.id = new UUID().toString();
    this.tasklet.creationDate = new Date();
    this.tasklet.tags = [];
    this.tags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.tasklet.tags.push(t);
      }
    );

    this.dialogRef.close(this.tasklet);
  }
}
