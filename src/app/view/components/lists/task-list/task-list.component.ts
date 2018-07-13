import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../../../services/entities/task.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {DateService} from '../../../../services/date.service';
import {Task} from '../../../../model/entities/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  @Output() onMenuItemClickedEmitter = new EventEmitter<string>();

  tasksOverdue = [];
  tasksNext = [];
  tasksInbox = [];
  tasksCompleted = [];

  tasksOverdueBadgeColor = 'transparent';
  tasksInboxBadgeColor = 'transparent';

  private tasksUnsubscribeSubject = new Subject();

  constructor(private taskService: TaskService,
              private dateService: DateService) {
  }

  ngOnInit() {

    // Subscribe task changes
    this.taskService.tasksSubject.pipe(
      takeUntil(this.tasksUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasksOverdue = (value as Task[]).filter(task => {
          return task != null
            && task.completionDate == null
            && task.dueDate != null
            && this.dateService.isBefore(task.dueDate, new Date());
        });
        this.tasksNext = (value as Task[]).filter(task => {
          return task != null
            && task.completionDate == null
            && task.dueDate != null
            && this.dateService.isAfter(task.dueDate, new Date());
        });
        this.tasksInbox = (value as Task[]).filter(task => {
          return task != null
            && task.completionDate == null
            && task.dueDate == null;
        });
        this.tasksCompleted = (value as Task[]).filter(task => {
          return task != null && task.completionDate != null;
        }).sort((t1: Task, t2: Task) => {
          const date1 = new Date(t1.completionDate).getTime();
          const date2 = new Date(t2.completionDate).getTime();

          return date2 - date1;
        });

        this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
        this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';
      }
    });
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
    this.onMenuItemClickedEmitter.emit(menuItem);
  }
}
