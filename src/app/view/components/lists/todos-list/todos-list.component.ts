import {Component, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {

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
