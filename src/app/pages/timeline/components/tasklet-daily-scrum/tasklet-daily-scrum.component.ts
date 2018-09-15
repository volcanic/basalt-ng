import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TaskletDailyScrum} from '../../../../core/entity/model/tasklet-daily-scrum.model';
import {DailyScrumActivityType} from '../../../../core/entity/model/daily-scrum-activity-type.enum';

/**
 * Displays daily scrum part of a tasklet
 */
@Component({
  selector: 'app-tasklet-daily-scrum',
  templateUrl: './tasklet-daily-scrum.component.html',
  styleUrls: ['./tasklet-daily-scrum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletDailyScrumComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: TaskletDailyScrum;

  /** Enum for daily scrum activity types */
  dailyScrumActivityType = DailyScrumActivityType;
}
