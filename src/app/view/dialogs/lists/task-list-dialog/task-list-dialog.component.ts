import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {TaskDialogComponent} from '../../entities/task-dialog/task-dialog.component';
import {DIALOG_MODE} from '../../../../model/ui/dialog-mode.enum';
import {Task} from '../../../../model/entities/task.model';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {TaskService} from '../../../../services/entities/task.service';
import {TagService} from '../../../../services/entities/tag.service';

@Component({
  selector: 'app-task-list-dialog',
  templateUrl: './task-list-dialog.component.html',
  styleUrls: ['./task-list-dialog.component.scss']
})
export class TaskListDialogComponent implements OnInit {

  dialogTitle = '';

  constructor(private taskService: TaskService,
              private tagService: TagService,
              private filterService: FilterService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
  }

  ngOnInit() {
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'add-task': {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add task',
            task: new Task('')
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const task = result as Task;

            this.taskService.createTask(task).then(() => {
              this.changeDetector.markForCheck();
            });
            this.filterService.updateTagsList(task.tagIds.map(id => {
              return this.tagService.getTagById(id);
            }).filter(tag => {
              return tag != null;
            }), true);
          }
        });
        break;
      }
    }
  }
}
