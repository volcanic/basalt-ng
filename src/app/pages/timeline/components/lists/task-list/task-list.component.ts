import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Task} from '../../../../../core/entity/model/task.model';
import {TaskService} from '../../../../../core/entity/services/task/task.service';
import {Project} from '../../../../../core/entity/model/project.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Action} from '../../../../../core/entity/model/action.enum';

/**
 * Displays task list
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnChanges {

  /** Map of tasks */
  @Input() tasksMap = new Map<string, Task>();
  /** Map of Ttasks that are currently filtered */
  @Input() tasksMapFiltered = new Map<string, Task>();
  /** Map of projects */
  @Input() projectsMap = new Map<string, Project>();

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
   * Handles on-changes lifecycle phase
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeTasks();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasks
   */
  private initializeTasks() {
    if (this.tasksMap != null) {
      const tasks = Array.from(this.tasksMap.values())
        .sort(TaskService.sortTasks);


      if (tasks != null) {
        this.tasksOverdue = tasks.filter(TaskService.isTaskOverdue);
        this.tasksToday = tasks.filter(TaskService.isTaskToday);
        this.tasksLater = tasks.filter(TaskService.isTaskLater);
        this.tasksInbox = tasks.filter(TaskService.isTaskInInbox).sort((t1, t2) => {
          return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
        });
        this.tasksDelegated = tasks.filter(TaskService.isTaskDelegated);
        this.tasksRecurring = tasks.filter(TaskService.isTaskRecurring).sort((t1, t2) => {
          return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
        });
        this.tasksCompleted = tasks.filter(TaskService.isTaskCompleted).sort((t1, t2) => {
          return new Date(t2.completionDate).getTime() > new Date(t1.completionDate).getTime() ? 1 : -1;
        });

        this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
        this.tasksTodayBadgeColor = (this.tasksToday.length > 0) ? 'accent' : 'primary';
        this.tasksLaterBadgeColor = (this.tasksLater.length > 0) ? 'accent' : 'primary';
        this.tasksRecurringBadgeColor = (this.tasksRecurring.length > 0) ? 'accent' : 'primary';
        this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';
      }
    }
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

  //
  // Helpers
  //

  /**
   * Determines whether a task in focus due to filter
   * @param task task
   */
  isInFocus(task: Task) {
    return this.tasksMapFiltered.size === 0 || Array.from(this.tasksMapFiltered.values()).some(t => {
      return task != null && t != null && t.name === task.name;
    });
  }
}
