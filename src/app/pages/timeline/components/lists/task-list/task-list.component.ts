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
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task, tasks?: Task[]}>();

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
        && (task.delegatedToId == null || task.delegatedToId === '')
        && (task.recurrenceInterval == null
          || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
          || task.recurrenceInterval === RecurrenceInterval.NONE)
        && DateService.isBefore(task.dueDate, new Date());
    }).sort(this.sortTasks);
    this.tasksNext = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && (task.delegatedToId == null || task.delegatedToId === '')
        && (task.recurrenceInterval == null
          || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
          || task.recurrenceInterval === RecurrenceInterval.NONE)
        && DateService.isAfter(task.dueDate, new Date());
    }).sort(this.sortTasks);
    this.tasksInbox = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate == null
        && (task.delegatedToId == null || task.delegatedToId === '')
        && (task.recurrenceInterval == null
          || task.recurrenceInterval === RecurrenceInterval.UNSPECIFIED
          || task.recurrenceInterval === RecurrenceInterval.NONE);
    });
    this.tasksDelegated = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && (task.delegatedToId != null && task.delegatedToId !== '');
    }).sort(this.sortTasks);
    this.tasksRecurring = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && (task.delegatedToId == null || task.delegatedToId === '')
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

  /**
   * Sorts tasks based on their due date & due time, effort estimation and priority
   * @param taskA
   * @param taskB
   * @return Returns -1 if taskA is of a higher order (i.e. before taskB), 0 if taskA and taskB are equal and 1 if task B is of a higher order
   */
  private sortTasks(taskA: Task, taskB: Task) {
    let returnValue = 0; // 0 does not sort, < 0 places taskA first, > 0 places taskB first

    const dueTimeA = new Date(taskA.dueDate).getTime() / 1000 / 60; // Get due time in milliseconds and convert to minutes
    const effortA = taskA.effort; // Get effort in minutes
    const calculatedStartA = dueTimeA - effortA; // Calculate start time for comparison with taskB
    const priorityA = taskA.priority; // get priority

    const dueTimeB = new Date(taskB.dueDate).getTime() / 1000 / 60; // Get due time in milliseconds and convert to minutes
    const effortB = taskB.effort; // Get effort in minutes
    const calculatedStartB = dueTimeB - effortB; // Calculate start time for comparison with taskB
    const priorityB = taskB.priority; // get priority

    if (dueTimeA < dueTimeB) {  // A comes first
      if (calculatedStartB < dueTimeA) { // B comes first
        if (priorityA < priorityB) { // A comes first
          returnValue = -1;
        } else { // B stays first
          returnValue = 1;
        }
      } else { // A stays first
        returnValue = -1;
      }
    } else if (dueTimeA === dueTimeB) {
      if (calculatedStartB < dueTimeA) { // B comes first
        if (priorityA < priorityB) { // A comes first
          returnValue = -1;
        } else { // B stays first
          returnValue = 1;
        }
      } else { // A stays first
        returnValue = -1;
      }
    } else { // B comes first
      if (calculatedStartA < dueTimeB) { // A comes first
        if (priorityB < priorityA) { // B comes first
          returnValue = 1;
        } else { // A stays first
          returnValue = -1;
        }
      } else { // B stays first
        returnValue = 1;
      }
    }

    return returnValue;
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
    this.onTaskEvent({action: Action.OPEN_DIALOG_ADD, task: null});
  }
}
