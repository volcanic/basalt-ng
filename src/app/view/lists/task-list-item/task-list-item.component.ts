import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Task} from '../../../model/entities/task.model';
import {TaskDialogComponent} from '../../dialogs/entities/task-dialog/task-dialog.component';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {MatDialog, MatMenuTrigger} from '@angular/material';
import {TaskService} from '../../../services/entities/task.service';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DigestService} from '../../../services/digest.service';
import {TaskDigest} from '../../../model/task-digest.model';
import {FilterService} from '../../../services/filter.service';
import {MediaService} from '../../../services/media.service';
import {takeUntil} from 'rxjs/internal/operators';
import {MEDIA} from '../../../model/media.enum';
import {Subject} from 'rxjs/index';


@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
  animations: [
    trigger('actionAnimation', [
      state('inactive', style({
        opacity: '0',
        width: '0'
      })),
      state('active', style({
        opacity: '0.6',
        width: '24px'
      })),
      transition('inactive => active', animate('0ms ease-in')),
      transition('active => inactive', animate('0ms ease-out'))
    ])
  ]
})
export class TaskListItemComponent implements OnInit {

  @Input() task: Task;
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  media: MEDIA = MEDIA.UNDEFINED;
  mediaType = MEDIA;

  state = 'inactive';
  taskDigest: TaskDigest;

  private unsubscribeSubject = new Subject();

  constructor(private taskService: TaskService,
              private taskletService: TaskletService,
              private digestService: DigestService,
              private snackbarService: SnackbarService,
              private filterService: FilterService,
              private mediaService: MediaService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.initializeMediaSubscription();
    this.taskDigest = this.digestService.getTaskDigest(this.task);
  }

  //
  // Initialization
  //

  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value;
    });
  }

  //
  // Actions
  //

  onActionFired(action: string) {
    switch (action) {
      case 'task': {
        if (this.media > this.mediaType.MEDIUM) {
          this.onActionFired('update-task');
        } else {
          this.contextMenuTrigger.openMenu();
        }
        break;
      }

      case 'update-task': {
        this.updateTask();
        break;
      }
      case 'continue-task': {
        this.continueTask();
        break;
      }
      case 'complete-task': {
        this.completeTask();
        break;
      }
      case 'reopen-task': {
        this.reopenTask();
        break;
      }
    }
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  updateTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update task',
        task: this.task
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const task = result as Task;

        this.taskService.updateTask(task);
        this.filterService.updateTagsList(task.tags, true);
        this.snackbarService.showSnackbar('Updated task', '');
      }
    });
  }

  continueTask() {
    const newTasklet = new Tasklet();
    newTasklet.taskId = this.task.id;
    newTasklet.type = TASKLET_TYPE.ACTION;
    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.ADD,
        dialogTitle: 'Add tasklet',
        tasklet: newTasklet,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as Tasklet;

        this.taskletService.createTasklet(tasklet);
        this.filterService.updateTagsList(tasklet.tags, true);
        this.snackbarService.showSnackbar('Added tasklet', '');
      }
    });
  }

  completeTask() {
    this.task.completionDate = new Date();
    this.taskService.updateTask(this.task);
    this.snackbarService.showSnackbar('Completed task', '');
  }

  reopenTask() {
    this.task.completionDate = null;
    this.taskService.updateTask(this.task);
    this.snackbarService.showSnackbar('Re-opened task', '');
  }
}
