import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {UUID} from '../../../model/util/uuid';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Tag} from '../../../model/tag.model';
import {TaskletCall} from '../../../model/tasklet-call.model';

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
  tags = [];

  taskOptions = [];
  filteredTaskOptions: Observable<string[]>;

  formControl: FormControl = new FormControl();

  taskletTypes = Object.keys(TASKLET_TYPE).map(key => TASKLET_TYPE[key]);

  existingTags: Tag[] = [];
  newTags: Tag[] = [];

  constructor(private taskletsService: TaskletsService,
              public dialogRef: MatDialogRef<TaskletDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));

  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.tasklet = this.data.tasklet;
    this.tags = this.data.tags;

    this.taskOptions = this.taskletsService.getTasks();
    this.filteredTaskOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterTasks(value))
      );

    this.tags.forEach(t => {
      this.existingTags.push(new Tag(t.value, false));
    });

    // Get existing suggestedTags and add empty tag to new suggestedTags
    this.existingTags.forEach(et => {
      if (this.tasklet.tags != null) {
        this.tasklet.tags.forEach(t => {
          if (et.value === t.value) {
            et.checked = true;
          }
        });
      }
    });
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

  addTasklet() {
    this.tasklet.id = new UUID().toString();
    this.tasklet.creationDate = new Date();
    this.tasklet.tags = [];
    this.existingTags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.tasklet.tags.push(t);
      }
    );

    switch (this.tasklet.type) {
      case TASKLET_TYPE.CALL: {
        this.dialogRef.close(this.tasklet as TaskletCall);
        break;
      }
      case TASKLET_TYPE.TODO: {
        const taskletTodo = this.tasklet as TaskletTodo;
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
    this.tasklet.tags = [];
    this.existingTags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.tasklet.tags.push(t);
      }
    );

    switch (this.tasklet.type) {
      case TASKLET_TYPE.CALL: {
        this.dialogRef.close(this.tasklet as TaskletCall);
        break;
      }
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

  filterTasks(val: string): string[] {
    return this.taskOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  tagChanged() {
    let noEmptyTag = true;

    this.newTags.forEach((t: Tag) => {
        if (t.value.trim().length === 0) {
          noEmptyTag = false;
        }
      }
    );

    if (noEmptyTag) {
      this.newTags.push(new Tag('', false));
    }
  }
}
