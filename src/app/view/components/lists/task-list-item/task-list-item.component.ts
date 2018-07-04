import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {TaskDialogComponent} from '../../../dialogs/entities/task-dialog/task-dialog.component';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {MatDialog} from '@angular/material';
import {TaskService} from '../../../../services/entities/task.service';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss']
})
export class TaskListItemComponent implements OnInit {
  @Input() task: Task;

  constructor(private taskService: TaskService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  updateTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update task',
        task: JSON.stringify(this.task)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskService.updateTask(result as Task);
      }
    });
  }
}
