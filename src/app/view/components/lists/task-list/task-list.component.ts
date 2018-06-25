import {Component, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasksOverdue = [];
  tasksToday = [];
  tasksLater = [];

  constructor() {
  }

  ngOnInit() {

    let t = new Task('Hello 1', "world");
    this.tasksOverdue.push(t);
  }


}
