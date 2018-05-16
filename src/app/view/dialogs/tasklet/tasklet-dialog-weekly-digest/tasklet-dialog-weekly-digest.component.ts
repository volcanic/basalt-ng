import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletTodo} from '../../../../model/tasklet-todo.model';
import {TASKLET_PRIORITY} from '../../../../model/tasklet-priority.enum';
import {DateService} from '../../../../services/date.service';
import {TaskletWeeklyDigest} from '../../../../model/tasklet-weekly-digest.model';

@Component({
  selector: 'app-tasklet-dialog-weekly-digest',
  templateUrl: './tasklet-dialog-weekly-digest.component.html',
  styleUrls: ['./tasklet-dialog-weekly-digest.component.scss']
})
export class TaskletDialogWeeklyDigestComponent implements OnInit {
  @Input() tasklet: TaskletWeeklyDigest;

  constructor() {
  }

  ngOnInit() {
  }
}
