import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {DateService} from '../../../services/date.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-tasklet-todo',
  templateUrl: './tasklet-todo.component.html',
  styleUrls: ['./tasklet-todo.component.scss']
})
export class TaskletTodoComponent implements OnInit {
  @Input() tasklet: TaskletTodo;
  @Output() onActionFired = new EventEmitter<string>();
  icon = '';
  iconDone = '';
  dueDate = '';

  constructor(private dateService: DateService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('timer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_black_24px.svg'));
    iconRegistry.addSvgIcon('done', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_done_grey_24px.svg'));
    iconRegistry.addSvgIcon('undone', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_undone_grey_24px.svg'));
  }

  ngOnInit() {
    this.icon = 'timer';
    this.iconDone = this.tasklet.done ? 'done' : 'undone';
    this.dueDate = this.dateService.getDate(this.tasklet.dueDate);
  }

  toggleDone() {
    this.tasklet.done = !this.tasklet.done;
    this.iconDone = this.tasklet.done ? 'done' : 'undone';
    this.onActionFired.next('save');
  }
}
