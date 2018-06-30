import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {MatDialog} from '@angular/material';
import {TaskDialogComponent} from '../../other/task-dialog/task-dialog.component';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {Task} from '../../../../model/entities/task.model';
import {TaskService} from '../../../../services/entities/task.service';
import {EntityService} from '../../../../services/entities/entity.service';
import EventEmitter = NodeJS.EventEmitter;

@Component({
  selector: 'app-tasklet-dialog-task',
  templateUrl: './tasklet-dialog-task.component.html',
  styleUrls: ['./tasklet-dialog-task.component.scss']
})
export class TaskletDialogTaskComponent implements OnInit {
  @Input() tasklet: Tasklet;
  task: Task;
  @Input() taskOptions = [];

  constructor(private entityService: EntityService,
              private taskService: TaskService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.task = this.entityService.getTaskByTasklet(this.tasklet);
  }

  onSelectionChanged() {
    this.tasklet.taskId = this.task.id;
  }

  compareTask(t1: Task, t2: Task) {
    return t1 != null && t2 != null && t1.id === t2.id;
  }

  addTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.ADD,
        dialogTitle: 'Add task',
        task: JSON.stringify(new Task(''))
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskService.createTask(result as Task);
        this.taskOptions.push(result as Task);
      }
    });
  }

  filterTasks(val: string): string[] {
    return this.taskOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }
}
