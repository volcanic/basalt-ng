import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletTodo} from '../../../model/tasklet-todo.model';

@Component({
  selector: 'app-tasklet-dialog-todo',
  templateUrl: './tasklet-dialog-todo.component.html',
  styleUrls: ['./tasklet-dialog-todo.component.scss']
})
export class TaskletDialogTodoComponent implements OnInit {
  @Input() tasklet: TaskletTodo;

  constructor() {
  }

  ngOnInit() {
  }

}
