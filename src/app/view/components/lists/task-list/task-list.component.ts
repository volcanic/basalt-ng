import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../../../services/entities/task.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {DateService} from '../../../../services/date.service';
import {Task} from '../../../../model/entities/task.model';
import {MatchService} from '../../../../services/match.service';
import {FilterService} from '../../../../services/filter.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  tasks = [];
  tasksOverdue = [];
  tasksNext = [];
  tasksInbox = [];
  tasksCompleted = [];

  tasksOverdueBadgeColor = 'transparent';
  tasksInboxBadgeColor = 'transparent';

  private tasksUnsubscribeSubject = new Subject();
  private filterUnsubscribeSubject = new Subject();

  constructor(private taskService: TaskService,
              private dateService: DateService,
              private matchService: MatchService,
              private filterService: FilterService
  ) {

  }


  ngOnInit() {

    // Subscribe task changes

    this.taskService.tasksSubject.pipe(
      takeUntil(this.tasksUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {

        this.updateTaskList(value);
        console.log('Notified by taskService ');
        console.log(this.tasks);
      }
    });

    this.filterService.filterSubject.pipe(
      takeUntil(this.filterUnsubscribeSubject)
    ).subscribe(() => {
      console.log('Notified by filterService');
      console.log(this.tasks);
      this.updateTaskList(this.tasks);
    });
  }

  private updateTaskList(value) {
    // Initialize filters
    this.taskService.updateTags();
    // this.filterService.initializeTags();

    this.tasks = value.filter(task => {
      return this.matchService.taskMatchesTags(task, Array.from(this.filterService.tags.values()));
      // this.matchService.taskMatchesEveryItem(task, this.filterService.searchItem)
      // && this.matchService.taskMatchesProjects(task, Array.from(this.filterService.projects.values()));
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
    });

    this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
    this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';
  }

  ngOnDestroy(): void {
    this.tasksUnsubscribeSubject.next();
    this.tasksUnsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }
}
