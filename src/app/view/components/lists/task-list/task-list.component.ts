import {Component, OnInit} from '@angular/core';
import {TaskService} from '../../../../services/entities/task.service';
import {Subject} from 'rxjs/Rx';
import {takeUntil} from 'rxjs/internal/operators';
import {DateService} from '../../../../services/date.service';
import {Task} from '../../../../model/entities/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasksOverdue = [];
  tasksNext = [];
  tasksInbox = [];

  private tasksUnsubscribeSubject = new Subject();

  constructor(private taskService: TaskService,
              private dateService: DateService) {
  }

  ngOnInit() {

    // Subscribe tasklet changes
    this.taskService.tasksSubject.pipe(
      takeUntil(this.tasksUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasksOverdue = (value as Task[]).filter(task => task != null && task.dueDate != null && this.dateService.isBefore(task.dueDate, new Date()));
        this.tasksNext = (value as Task[]).filter(task => task != null && task.dueDate != null && this.dateService.isAfter(task.dueDate, new Date()));
        this.tasksInbox = (value as Task[]).filter(task => task == null || task.dueDate == null);
      }
    });
  }
}
