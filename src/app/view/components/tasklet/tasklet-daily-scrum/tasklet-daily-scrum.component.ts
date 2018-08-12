import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletDailyScrum} from '../../../../model/entities/scrum/tasklet-daily-scrum.model';
import {DAILY_SCRUM_ACTIVITY_TYPE} from '../../../../model/entities/scrum/daily-scrum-activity-type.enum';

@Component({
  selector: 'app-tasklet-daily-scrum',
  templateUrl: './tasklet-daily-scrum.component.html',
  styleUrls: ['./tasklet-daily-scrum.component.scss']
})
export class TaskletDailyScrumComponent implements OnInit {
  @Input() tasklet: TaskletDailyScrum;

  type = DAILY_SCRUM_ACTIVITY_TYPE;

  constructor() {
  }

  ngOnInit() {
  }

}
