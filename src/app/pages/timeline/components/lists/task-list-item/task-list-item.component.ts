import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Task} from 'app/core/entity/model/task.model';
import {MatMenuTrigger} from '@angular/material';
import {Animations, AnimationState} from './task-list-item.animation';
import {Media} from 'app/core/ui/model/media.enum';
import {TaskDigest} from 'app/core/digest/model/task-digest.model';
import {Action} from 'app/core/entity/model/action.enum';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';

/**
 * Displays task list item
 */
@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
  animations: [
    Animations.actionAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TaskListItemComponent implements OnInit {

  /** Task to be displayed */
  @Input() task: Task;
  /** Task digest */
  @Input() taskDigest: TaskDigest;
  /** Current media */
  @Input() media: Media;
  /** Indicates if item is active */
  @Input() active = true;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task, tasks?: Task[], omitReferenceEvaluation?: boolean }>();

  /** View child for popover menu trigger */
  @ViewChild(MatMenuTrigger) popoverMenuTrigger: MatMenuTrigger;
  /** View child for context menu trigger */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Enum for media types */
  mediaType = Media;
  /** Icon name */
  icon = '';
  /** Container animation state */
  containerState = AnimationState.INACTIVE;
  /** Popover animation state */
  popoverState = AnimationState.INACTIVE;

  //
  // Helpers
  //

  /**
   * Determines if task is complete
   * @param task task
   */
  private static isTaskComplete(task: Task): boolean {
    return task.dueDate != null
      && task.description != null && task.description.value != null
      && task.acceptanceCriteria != null && task.acceptanceCriteria.length > 0
      && task.projectId != null
      && task.dueDate != null
      && task.priority != null
      && task.effort != null
      && task.tagIds != null;
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeIcon();
  }

  //
  // Initialization
  //

  /**
   * Initializes icon
   */
  private initializeIcon() {
    if (this.task != null
      && this.task.completionDate == null
      && this.task.recurrenceInterval != null
      && (this.task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED && this.task.recurrenceInterval !== RecurrenceInterval.NONE)) {
      this.icon = 'loop';
    } else if (this.task != null && this.task.delegatedToId != null && this.task.delegatedToId !== '') {
      this.icon = 'person';
    } else if (this.task != null && TaskListItemComponent.isTaskComplete(this.task)) {
      this.icon = 'alias_task';
    } else {
      this.icon = 'alias_task_unassigned';
    }
  }

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.containerState = hovered ? AnimationState.ACTIVE : AnimationState.INACTIVE;
  }

  /**
   * Handles hover over popover
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverPopover(hovered: boolean) {
    this.popoverState = hovered ? AnimationState.ACTIVE : AnimationState.INACTIVE;
  }

  /**
   * Handles clicks on task item
   */
  onTaskClicked() {
    this.popoverMenuTrigger.openMenu();
  }

  onDetailsClicked() {
    this.taskEventEmitter.emit({
      action: Action.OPEN_DIALOG_UPDATE, task: this.task
    });
  }

  /**
   * Handles clicks on complete button
   */
  onCompleteClicked() {
    this.taskEventEmitter.emit({action: Action.COMPLETE, task: this.task, omitReferenceEvaluation: true});
  }

  /**
   * Handles clicks on continue button
   */
  onContinueClicked() {
    this.taskEventEmitter.emit({action: Action.OPEN_DIALOG_CONTINUE, task: this.task});
  }

  /**
   * Handles clicks on re-open button
   */
  onReopenClicked() {
    this.taskEventEmitter.emit({action: Action.REOPEN, task: this.task});
  }

  /**
   * Handles clicks on filter button
   */
  onFilterClicked() {
    this.taskEventEmitter.emit({action: Action.FILTER_SINGLE, task: null, tasks: [this.task]});
  }
}
