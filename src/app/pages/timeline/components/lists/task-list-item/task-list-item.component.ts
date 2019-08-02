import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Task} from 'app/core/entity/model/task.model';
import {MatMenuTrigger} from '@angular/material';
import {Animations, AnimationState} from './task-list-item.animation';
import {Media} from 'app/core/ui/model/media.enum';
import {TaskDigest} from 'app/core/digest/model/task-digest.model';
import {Action} from 'app/core/entity/model/action.enum';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';
import {Project} from '../../../../../core/entity/model/project.model';
import {DateService} from '../../../../../core/entity/services/date.service';
import {environment} from '../../../../../../environments/environment';

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
export class TaskListItemComponent implements OnInit, OnChanges {

  /** Task to be displayed */
  @Input() task: Task;
  /** Map of projects */
  @Input() projectsMap = new Map<string, Project>();
  /** Task digest */
  @Input() taskDigest: TaskDigest;
  /** Current media */
  @Input() media: Media;
  /** Indicates if item is active */
  @Input() active = true;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task, tasks?: Task[], omitReferenceEvaluation?: boolean }>();
  /** View child for context menu */
  @ViewChild(MatMenuTrigger, {static: false}) contextMenuTrigger: MatMenuTrigger;

  /** Project color */
  projectColor: string;

  /** Enum for media types */
  mediaType = Media;
  /** Icon name */
  icon = '';
  /** Animation state */
  state = AnimationState.INACTIVE;

  /** Debug mode */
  debugMode = environment.DEBUG_MODE;

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

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeIconColor();
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

  /**
   * Initializes icon color
   */
  private initializeIconColor() {
    const project = (this.task != null) ? this.projectsMap.get(this.task.projectId) : null;
    this.projectColor = (project != null && project.color != null) ? project.color : '';
  }

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param hovered whether there is currently a hover event
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
   * Handles click on postpone
   * @param option option
   */
  onPostponeClicked(option: string) {
    switch (option) {
      case 'later':
        this.task.dueDate = DateService.getEndOfBusiness(new Date());
        break;
      case 'tomorrow':
        this.task.dueDate = DateService.getNextDayStart(new Date());
        break;
      case 'this_weekend':
        this.task.dueDate = DateService.getBeginningOfNextWeekend(new Date());
        break;
      case 'next_week':
        this.task.dueDate = DateService.getBeginningNextWeek(new Date());
        break;
    }

    this.taskEventEmitter.emit({
      action: Action.UPDATE,
      task: this.task
    });
    // Finish
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
