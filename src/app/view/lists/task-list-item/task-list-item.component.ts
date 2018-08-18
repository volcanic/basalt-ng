import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Task} from '../../../model/entities/task.model';
import {TaskDialogComponent} from '../../dialogs/entities/task-dialog/task-dialog.component';
import {DialogMode} from '../../../model/ui/dialog-mode.enum';
import {MatDialog, MatMenuTrigger} from '@angular/material';
import {TaskService} from '../../../services/entities/task.service';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {SnackbarService} from '../../../services/ui/snackbar.service';
import {TaskletType} from '../../../model/tasklet-type.enum';
import {DigestService} from '../../../services/entities/digest/digest.service';
import {TaskDigest} from '../../../model/entities/digest/task-digest.model';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {MediaService} from '../../../services/ui/media.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Media} from '../../../model/ui/media.enum';
import {Subject} from 'rxjs/Subject';
import {ProjectService} from '../../../services/entities/project.service';
import {Animations, AnimationState} from './task-list-item.animation';
import {TagService} from '../../../services/entities/tag.service';

/**
 * Displays task list item
 */
@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
  animations: [
    Animations.actionAnimation
  ]
})
export class TaskListItemComponent implements OnInit {

  /** Task to be display */
  @Input() task: Task;
  /** View child for context menu */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Enum for media types */
  mediaType = Media;
  /** Current media */
  media: Media = Media.UNDEFINED;

  /** Animation state */
  state = AnimationState.INACTIVE;

  /** Task digest */
  taskDigest: TaskDigest;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {TaskService} taskService
   * @param {TaskletService} taskletService
   * @param {TagService} tagService
   * @param {DigestService} digestService
   * @param {SnackbarService} snackbarService
   * @param {FilterService} filterService
   * @param {MediaService} mediaService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   */
  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private digestService: DigestService,
              private snackbarService: SnackbarService,
              private filterService: FilterService,
              private mediaService: MediaService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeMediaSubscription();
    this.taskDigest = this.digestService.getTaskDigest(this.task);
  }

  //
  // Initialization
  //

  /**
   * Initializes media subscription
   */
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

  /**
   * Handles actions being fired
   * @param {string} action action that was fired
   */
  onActionFired(action: string) {
    switch (action) {
      case 'task': {
        if (this.media > this.mediaType.MEDIUM) {
          this.onActionFired('notify-task');
        } else {
          this.contextMenuTrigger.openMenu();
        }
        break;
      }
      case 'notify-task': {
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

  /**
   * Handles hover over container
   * @param {boolean} hovered true if hovered
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? AnimationState.ACTIVE : AnimationState.INACTIVE;
  }

  //
  // Button actions
  //

  /**
   * Handles click on update button
   */
  private updateTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      disableClose: false,
      data: {
        mode: DialogMode.UPDATE,
        dialogTitle: 'Update task',
        task: this.task
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const task = result as Task;
        const project = this.projectService.projects.get(task.projectId);

        this.taskService.updateTask(task, true).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateProjectsList([project], true);
        this.filterService.updateTagsList(task.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), true);
      }
    });
  }

  /**
   * Handles click on continue button
   */
  private continueTask() {
    const newTasklet = new Tasklet();
    newTasklet.taskId = this.task.id;
    newTasklet.type = TaskletType.ACTION;
    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DialogMode.ADD,
        dialogTitle: 'Add tasklet',
        tasklet: newTasklet,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const tasklet = result as Tasklet;

        this.taskletService.createTasklet(tasklet).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updateTagsList(tasklet.tagIds.map(id => {
          return this.tagService.getTagById(id);
        }).filter(tag => {
          return tag != null;
        }), true);
      }
    });
  }

  /**
   * Handles click on complete button
   */
  private completeTask() {
    this.task.completionDate = new Date();
    this.taskService.updateTask(this.task, false).then(() => {
      this.changeDetector.markForCheck();
    });
    this.snackbarService.showSnackbar('Completed task');
  }

  /**
   * Handles click on re-open button
   */
  private reopenTask() {
    this.task.completionDate = null;
    this.taskService.updateTask(this.task, false).then(() => {
      this.changeDetector.markForCheck();
    });
    this.snackbarService.showSnackbar('Re-opened task');
  }
}
