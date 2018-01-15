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

  taskOptions = [];
  filteredTaskOptions: Observable<string[]>;

  myControl: FormControl = new FormControl();

  taskletTypes = Object.keys(TASKLET_TYPE).map(key => TASKLET_TYPE[key]);

  existingTags: Tag[] = [];
  newTags: Tag[] = [];

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

    this.taskOptions = this.taskletsService.getTasks();
    this.filteredTaskOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterTasks(value))
      );

    this.taskletsService.getAllTags().forEach(t => {
      this.existingTags.push(new Tag(t.value, false));
    });

    // Get existing tags and add empty tag to new tags
    this.existingTags.forEach(et => {
      this.tasklet.tags.forEach(t => {
        if (et.value === t.value) {
          et.checked = true;
        }
      });
    });
    this.newTags.push(new Tag('', false));
  }

  typeSelected(type: string) {
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
    this.tasklet.tags = [];
    this.existingTags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.tasklet.tags.push(t);
      }
    );

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

  filterTasks(val: string): string[] {
    return this.taskOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  tagChanged(value: string) {
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
