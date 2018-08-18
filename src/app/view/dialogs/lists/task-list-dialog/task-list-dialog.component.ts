import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {TaskDialogComponent} from '../../entities/task-dialog/task-dialog.component';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {Task} from '../../../../model/entities/task.model';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {TaskService} from '../../../../services/entities/task.service';
import {TagService} from '../../../../services/entities/tag.service';

/**
 * Displays task list dialog
 */
@Component({
  selector: 'app-task-list-dialog',
  templateUrl: './task-list-dialog.component.html',
  styleUrls: ['./task-list-dialog.component.scss']
})
export class TaskListDialogComponent {

  /** Dialog title */
  dialogTitle = '';

  /**
   * Constructor
   * @param {TaskService} taskService
   * @param {TagService} tagService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   * @param data dialog data
   */
  constructor(private taskService: TaskService,
              private tagService: TagService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogTitle = data.dialogTitle;
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'add-task': {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data: {
            mode: DialogMode.ADD,
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
