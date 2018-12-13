import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Task} from '../../../../../core/entity/model/task.model';
import {Media} from 'app/core/ui/model/media.enum';
import {Action} from 'app/core/entity/model/action.enum';
import {TaskService} from '../../../../../core/entity/services/task/task.service';

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
  /** Tasks that are currently filtered */
  @Input() tasksFiltered = [];
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task, tasks?: Task[] }>();

  /** Tasks having a due date before now */
  tasksOverdue = [];
  /** Tasks having a due date today */
  tasksToday = [];
  /** Tasks having a due date after today */
  tasksLater = [];
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
  /** Background personColor for today badge */
  tasksTodayBadgeColor = 'transparent';
  /** Background personColor for later badge */
  tasksLaterBadgeColor = 'transparent';
  /** Background personColor for inbox badge */
  tasksInboxBadgeColor = 'transparent';
  /** Background personColor for delegated badge */
  tasksDelegatedBadgeColor = 'transparent';
  /** Background personColor for recurring badge */
  tasksRecurringBadgeColor = 'transparent';

  /**
   * Constructor
   * @param taskService task service
   */
  constructor(private taskService: TaskService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTaskCategories();
  }

  /**
   * Handles on-changes lifecycle phase
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
    this.tasksOverdue = this.tasks.filter(this.taskService.isTaskOverdue);
    this.tasksToday = this.tasks.filter(this.taskService.isTaskToday);
    this.tasksLater = this.tasks.filter(this.taskService.isTaskLater);
    this.tasksInbox = this.tasks.filter(this.taskService.isTaskInInbox).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    });
    this.tasksDelegated = this.tasks.filter(this.taskService.isTaskDelegated);
    this.tasksRecurring = this.tasks.filter(this.taskService.isTaskRecurring).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    });
    this.tasksCompleted = this.tasks.filter(this.taskService.isTaskCompleted).sort((t1, t2) => {
      return new Date(t2.completionDate).getTime() > new Date(t1.completionDate).getTime() ? 1 : -1;
    });

    this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
    this.tasksTodayBadgeColor = (this.tasksToday.length > 0) ? 'accent' : 'primary';
    this.tasksLaterBadgeColor = (this.tasksLater.length > 0) ? 'accent' : 'primary';
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
    this.onTaskEvent({action: Action.OPEN_DIALOG_ADD, task: null});
  }

  //
  // Helpers
  //

  /**
   * Determines whether a task in focus due to filter
   * @param task task
   */
  isInFocus(task: Task) {
    return this.tasksFiltered.length === 0 || this.tasksFiltered.some(t => {
      return task != null && t != null && t.name === task.name;
    });
  }
}
