import {Component, Input, OnInit} from '@angular/core';
import {TaskletDailyScrum} from '../../../../model/entities/scrum/tasklet-daily-scrum.model';
import {DailyScrumActivityType} from '../../../../model/entities/scrum/daily-scrum-activity-type.enum';

/**
 * Displays daily scrum part of a tasklet
 */
@Component({
  selector: 'app-tasklet-daily-scrum',
  templateUrl: './tasklet-daily-scrum.component.html',
  styleUrls: ['./tasklet-daily-scrum.component.scss']
})
export class TaskletDailyScrumComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: TaskletDailyScrum;

  /** Reference to static method */
  type = DailyScrumActivityType;
}
