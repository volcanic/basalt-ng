import {Component, Input, OnInit} from '@angular/core';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {TASKLET_PRIORITY} from '../../../model/tasklet-priority.enum';

@Component({
  selector: 'app-tasklet-dialog-todo',
  templateUrl: './tasklet-dialog-todo.component.html',
  styleUrls: ['./tasklet-dialog-todo.component.scss']
})
export class TaskletDialogTodoComponent implements OnInit {
  @Input() tasklet: TaskletTodo;

  taskletPriorities = Object.keys(TASKLET_PRIORITY).map(key => TASKLET_PRIORITY[key]);

  constructor() {
  }

  ngOnInit() {
  }

}
