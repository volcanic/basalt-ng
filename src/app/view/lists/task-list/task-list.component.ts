import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {TaskService} from '../../../services/entities/task.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {DateService} from '../../../services/util/date.service';
import {Task} from '../../../model/entities/task.model';
import {MatchService} from '../../../services/entities/filter/match.service';
import {FilterService} from '../../../services/entities/filter/filter.service';

/**
 * Displays task list
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnDestroy {

  /** Event emitter indicating menu items being clicked */
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  /** Tasks to be displayed */
  tasks = [];
  /** Unfiltered tasks */
  tasksAll = [];

  /** Tasks having a due date before now */
  tasksOverdue = [];
  /** Tasks having a due date after now */
  tasksNext = [];
  /** Tasks not having a due date */
  tasksInbox = [];
  /** Tasks with a completion date */
  tasksCompleted = [];

  /** Background color for overdue badge */
  tasksOverdueBadgeColor = 'transparent';
  /** Background color for next badge */
  tasksNextBadgeColor = 'transparent';
  /** Background color for inbox badge */
  tasksInboxBadgeColor = 'transparent';

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {TaskService} taskService
   * @param {DateService} dateService
   * @param {MatchService} matchService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private taskService: TaskService,
              private dateService: DateService,
              private matchService: MatchService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeTaskSubscription();
    this.initializeFilterSubscription();
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes task subscription
   */
  private initializeTaskSubscription() {
    this.tasksAll = Array.from(this.taskService.tasks.values());
    this.update();

    this.taskService.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasksAll = value as Task[];
        this.update();
      }
    });
  }

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Filters original values
   */
  private update() {
    this.tasks = this.tasksAll.filter(task => {
      const matchesSearchItem = this.matchService.taskMatchesEveryItem(task, this.filterService.searchItem);
      const matchesTags = this.matchService.taskMatchesTags(task, Array.from(this.filterService.tags.values()),
        this.filterService.tagsNone);
      const matchesProjects = this.matchService.taskMatchesProjects(task,
        Array.from(this.filterService.projects.values()), this.filterService.projectsNone);

      return matchesSearchItem && matchesTags && matchesProjects;
    });

    this.tasksOverdue = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && DateService.isBefore(task.dueDate, new Date());
    }).sort((t1: Task, t2: Task) => {
      return -MatchService.compare(t1.modificationDate.toString(), t2.modificationDate.toString());
    });
    this.tasksNext = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && DateService.isAfter(task.dueDate, new Date());
    }).sort((t1: Task, t2: Task) => {
      return -MatchService.compare(t1.modificationDate.toString(), t2.modificationDate.toString());
    });
    this.tasksInbox = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate == null;
    }).sort((t1: Task, t2: Task) => {
      return -MatchService.compare(t1.modificationDate.toString(), t2.modificationDate.toString());
    });
    this.tasksCompleted = this.tasks.filter(task => {
      return task != null && task.completionDate != null;
    }).sort((t1: Task, t2: Task) => {
      return -MatchService.compare(t1.completionDate.toString(), t2.completionDate.toString());
    });

    this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
    this.tasksNextBadgeColor = (this.tasksNext.length > 0) ? 'accent' : 'primary';
    this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';

    this.changeDetector.markForCheck();
  }
}
