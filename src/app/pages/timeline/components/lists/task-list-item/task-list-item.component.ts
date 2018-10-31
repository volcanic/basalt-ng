import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListItemComponent implements OnInit {

  /** Task to be displayed */
  @Input() task: Task;
  /** Task digest */
  @Input() taskDigest: TaskDigest;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task, tasks?: Task[], omitReferenceEvaluation?: boolean }>();
  /** View child for context menu */
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;

  /** Enum for media types */
  mediaType = Media;
  /** Icon name */
  icon = '';
  /** Animation state */
  state = AnimationState.INACTIVE;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
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
    } else if (this.task != null && this.task.projectId != null && this.task.projectId !== '') {
      this.icon = 'turned_in';
    } else {
      this.icon = 'turned_in_not';
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
    this.state = hovered ? AnimationState.ACTIVE : AnimationState.INACTIVE;
  }

  /**
   * Handles clicks on task item
   */
  onTaskClicked() {
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
    this.taskEventEmitter.emit({action: Action.FILTER_LIST, task: null, tasks: [this.task]});
  }
}
