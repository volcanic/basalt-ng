import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {DateService} from '../../../services/date.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {TASKLET_PRIORITY} from '../../../model/tasklet-priority.enum';

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
  iconPriority = '';
  iconPriorityCount = [];
  dueDate = '';

  constructor(private dateService: DateService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('timer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_black_24px.svg'));
    iconRegistry.addSvgIcon('assistant', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_black_24px.svg'));
    iconRegistry.addSvgIcon('prio1', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio1_24px.svg'));
    iconRegistry.addSvgIcon('prio2', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio2_24px.svg'));
    iconRegistry.addSvgIcon('prio3', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio3_24px.svg'));
    iconRegistry.addSvgIcon('prio4', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio4_24px.svg'));
  }

  ngOnInit() {
    this.icon = 'timer';
    this.iconDone = this.tasklet.done ? 'done' : 'undone';
    this.dueDate = this.dateService.getDate(this.tasklet.dueDate);

    switch (this.tasklet.priority) {
      case TASKLET_PRIORITY.ONE: {
        this.iconPriority = 'prio1';
        this.iconPriorityCount = [''];
        break;
      }
      case TASKLET_PRIORITY.TWO: {
        this.iconPriority = 'prio2';
        this.iconPriorityCount = ['', ''];
        break;
      }
      case TASKLET_PRIORITY.THREE: {
        this.iconPriority = 'prio3';
        this.iconPriorityCount = ['', '', ''];
        break;
      }
      case TASKLET_PRIORITY.FOUR: {
        this.iconPriority = 'prio4';
        this.iconPriorityCount = ['', '', '', ''];
        break;
      }
    }
  }

  onToggledDone() {
    this.onActionFired.next('save');
  }
}
