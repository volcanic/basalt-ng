import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {UUID} from '../../../model/util/uuid';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {FormControl} from '@angular/forms';

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

  formControl: FormControl = new FormControl();
  options = [];

  taskletTypes = Object.keys(TASKLET_TYPE).map(key => TASKLET_TYPE[key]);

  constructor(private taskletsService: TaskletsService,
              public dialogRef: MatDialogRef<TaskletDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));

    // Create basic tasklet
    this.tasklet = new Tasklet();
  }

  ngOnInit() {
    if (this.data == null) {
      this.mode = DIALOG_MODE.ADD;
      this.dialogTitle = 'Add tasklet';
    } else {
      this.mode = DIALOG_MODE.UPDATE;
      this.dialogTitle = 'Update tasklet';
      this.tasklet = this.data.tasklet as Tasklet;
    }

    this.options = this.taskletsService.getTasks();
  }

  typeSelected(type: string) {
  }

  addTasklet() {
    this.tasklet.id = new UUID().toString();
    this.tasklet.creationDate = new Date();

    switch (this.tasklet.type) {
      case TASKLET_TYPE.TODO: {
        let taskletTodo = this.tasklet as TaskletTodo;
        taskletTodo.done = false;
        this.dialogRef.close(taskletTodo);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet);
      }
    }

  }

  updateTasklet() {
    switch (this.tasklet.type) {
      case TASKLET_TYPE.TODO: {
        this.dialogRef.close(this.tasklet as TaskletTodo);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
    }
  }
}
