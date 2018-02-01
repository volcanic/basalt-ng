import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {TASKLET_PRIORITY} from '../../../model/tasklet-priority.enum';

@Component({
  selector: 'app-tasklet-dialog-todo',
  templateUrl: './tasklet-dialog-todo.component.html',
  styleUrls: ['./tasklet-dialog-todo.component.scss']
})
export class TaskletDialogTodoComponent implements OnInit {
  @Input() tasklet: TaskletTodo;
  @Output() onHourSelectedEmitter = new EventEmitter<string>();
  @Output() onMinuteSelectedEmitter = new EventEmitter<string>();

  hour = 0;
  minute = 0;
  hours = [];
  minutes = [];

  taskletPriorities = Object.keys(TASKLET_PRIORITY).map(key => TASKLET_PRIORITY[key]);

  constructor() {
  }

  ngOnInit() {
    for (let h = 0; h < 24; h++) {
      this.hours.push(h);
    }
    for (let m = 0; m < 60; m++) {
      this.minutes.push(m);
    }

    this.hour = new Date(this.tasklet.dueDate).getHours();
    this.minute = new Date(this.tasklet.dueDate).getMinutes();
  }

  onHourSelected(value: string) {
    this.onHourSelectedEmitter.next(value);
  }

  onMinuteSelected(value: string) {
    this.onMinuteSelectedEmitter.next(value);
  }

  addTrailingZero(value: number) {
    if (value < 10) {
      return `0${value}`;
    }

    return value;
  }
}
