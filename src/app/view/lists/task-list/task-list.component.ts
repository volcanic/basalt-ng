import {Component, EventEmitter, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../../services/entities/task.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {DateService} from '../../../services/date.service';
import {Task} from '../../../model/entities/task.model';
import {MatchService} from '../../../services/match.service';
import {FilterService} from '../../../services/filter.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  tasks = [];
  tasksAll = [];

  tasksOverdue = [];
  tasksNext = [];
  tasksInbox = [];
  tasksCompleted = [];

  tasksOverdueBadgeColor = 'transparent';
  tasksNextBadgeColor = 'transparent';
  tasksInboxBadgeColor = 'transparent';

  DISPLAY_LIMIT = 20;

  private unsubscribeSubject = new Subject();

  constructor(private taskService: TaskService,
              private dateService: DateService,
              private matchService: MatchService,
              private filterService: FilterService,
              public zone: NgZone) {
  }

  ngOnInit() {

    this.initializeTaskSubscription();
    this.initializeFilterSubscription();
  }

  /**
   * Subscribes task changes
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

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Subscribes filter changes
   */
  private initializeFilterSubscription() {

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
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
        && this.dateService.isBefore(task.dueDate, new Date());
    });
    this.tasksNext = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && this.dateService.isAfter(task.dueDate, new Date());
    });
    this.tasksInbox = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate == null;
    });
    this.tasksCompleted = this.tasks.filter(task => {
      return task != null && task.completionDate != null;
    }).sort((t1: Task, t2: Task) => {
      const date1 = new Date(t1.completionDate).getTime();
      const date2 = new Date(t2.completionDate).getTime();

      return date2 - date1;
    }).slice(0, this.DISPLAY_LIMIT);

    this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
    this.tasksNextBadgeColor = (this.tasksNext.length > 0) ? 'accent' : 'primary';
    this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';

    this.zone.run(() => this.tasks = JSON.parse(JSON.stringify(this.tasks)));
  }
}