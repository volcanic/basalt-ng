import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import {Task} from '../../../../../core/entity/model/task.model';
import {TaskService} from '../../../../../core/entity/services/task/task.service';
import {Project} from '../../../../../core/entity/model/project.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Action} from '../../../../../core/entity/model/action.enum';
import {environment} from '../../../../../../environments/environment';

/**
 * Displays task list
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnChanges, OnDestroy {

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
  /** Tasks having a due date tomorrow */
  tasksTomorrow = [];
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
  /** Proxy tasks */
  tasksProxy = [];

  /** Background personColor for overdue badge */
  tasksOverdueBadgeColor = 'transparent';
  /** Background personColor for today badge */
  tasksTodayBadgeColor = 'transparent';
  /** Background personColor for today badge */
  tasksTomorrowBadgeColor = 'transparent';
  /** Background personColor for later badge */
  tasksLaterBadgeColor = 'transparent';
  /** Background personColor for inbox badge */
  tasksInboxBadgeColor = 'transparent';
  /** Background personColor for delegated badge */
  tasksDelegatedBadgeColor = 'transparent';
  /** Background personColor for recurring badge */
  tasksRecurringBadgeColor = 'transparent';

  /** Debug mode */
  debugMode = environment.DEBUG_MODE;

  /** Holds the set interval in order to destroy it in onDestroy */
  intervalHolder: any;

  /**
   * Constructor
   * @param taskService task service
   */
  constructor(private taskService: TaskService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  //
  // Lifecycle hooks
  //

  ngOnInit() {
    const changeDetectionInterval = 1000 * 10; // 10 seconds
    this.intervalHolder = setInterval(() => {
      // this.changeDetectorRef.detectChanges(); // Does not seem to trigger ngOnChanges (neither does .markForCheck()). There might be a better way to update regularly.
      this.initializeTasks();
    }, changeDetectionInterval);
  }

  /**
   * Handles on-changes lifecycle phase
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeTasks();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalHolder);
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
        this.tasksTomorrow = tasks.filter(TaskService.isTaskTomorrow);
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
        this.tasksProxy = tasks.filter(t => {
          return t.proxy;
        }).sort((t1, t2) => {
          return new Date(t2.completionDate).getTime() > new Date(t1.completionDate).getTime() ? 1 : -1;
        });

        this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
        this.tasksTodayBadgeColor = (this.tasksToday.length > 0) ? 'accent' : 'primary';
        this.tasksTomorrowBadgeColor = (this.tasksTomorrow.length > 0) ? 'accent' : 'primary';
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

  /**
   * Handles click on placeholder
   */
  onPlaceholderClicked() {
    this.taskEventEmitter.emit({action: Action.OPEN_DIALOG_ADD, task: null});
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
