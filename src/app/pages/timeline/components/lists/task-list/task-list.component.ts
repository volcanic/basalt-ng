import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Task} from '../../../../../core/entity/model/task.model';
import {DateService} from 'app/core/entity/services/date.service';
import {Media} from 'app/core/ui/model/media.enum';
import {Action} from 'app/core/entity/model/action.enum';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';

/**
 * Displays task list
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnChanges {

  /** Tasks to be displayed */
  @Input() tasks = [];
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task }>();

  /** Tasks having a due date before now */
  tasksOverdue = [];
  /** Tasks having a due date after now */
  tasksNext = [];
  /** Tasks not having a due date */
  tasksInbox = [];
  /** Delegated tasks */
  tasksDelegated = [];
  /** Recurring tasks */
  tasksRecurring = [];
  /** Tasks with a completion date */
  tasksCompleted = [];

  /** Background personColor for overdue badge */
  tasksOverdueBadgeColor = 'transparent';
  /** Background personColor for next badge */
  tasksNextBadgeColor = 'transparent';
  /** Background personColor for inbox badge */
  tasksInboxBadgeColor = 'transparent';
  /** Background personColor for delegated badge */
  tasksDelegatedBadgeColor = 'transparent';
  /** Background personColor for recurring badge */
  tasksRecurringBadgeColor = 'transparent';
  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeTaskCategories();
  }

  /**
   * Handles on-changes lifecycle hook
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.initializeTaskCategories();
  }

  //
  // Initialization
  //

  /**
   * Initializes task categories
   */
  initializeTaskCategories() {
    this.tasksOverdue = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && (task.delegatedToId == null || task.delegatedToId == '')
        && (task.recurrenceInterval == null
          || task.recurrenceInterval == RecurrenceInterval.UNSPECIFIED
          || task.recurrenceInterval == RecurrenceInterval.NONE)
        && DateService.isBefore(task.dueDate, new Date());
    });
    this.tasksNext = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && (task.delegatedToId == null || task.delegatedToId == '')
        && (task.recurrenceInterval == null
          || task.recurrenceInterval == RecurrenceInterval.UNSPECIFIED
          || task.recurrenceInterval == RecurrenceInterval.NONE)
        && DateService.isAfter(task.dueDate, new Date());
    });
    this.tasksInbox = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate == null
        && (task.delegatedToId == null || task.delegatedToId == '')
        && (task.recurrenceInterval == null
          || task.recurrenceInterval == RecurrenceInterval.UNSPECIFIED
          || task.recurrenceInterval == RecurrenceInterval.NONE);
    });
    this.tasksDelegated = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && (task.delegatedToId != null && task.delegatedToId != '');
    });
    this.tasksRecurring = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && (task.delegatedToId == null || task.delegatedToId == '')
        && task.recurrenceInterval != null
        && (task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED && task.recurrenceInterval !== RecurrenceInterval.NONE);
    });
    this.tasksCompleted = this.tasks.filter(task => {
      return task != null && task.completionDate != null;
    });

    this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
    this.tasksNextBadgeColor = (this.tasksNext.length > 0) ? 'accent' : 'primary';
    this.tasksRecurringBadgeColor = (this.tasksRecurring.length > 0) ? 'accent' : 'primary';
    this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';
  }

  //
  // Actions
  //

  /**
   * Handles task event
   * @param event event
   */
  onTaskEvent(event: any) {
    this.taskEventEmitter.emit(event);
  }

  /**
   * Handles click on add button
   */
  onAddClicked() {
    this.onTaskEvent({action: Action.OPEN_DIALOG_ADD, task: null})
  }
}
