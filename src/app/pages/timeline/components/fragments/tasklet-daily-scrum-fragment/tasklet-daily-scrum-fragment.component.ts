import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TaskletDailyScrum} from '../../../../../core/entity/model/daily-scrum/tasklet-daily-scrum.model';
import {DailyScrumActivityType} from '../../../../../core/entity/model/daily-scrum/daily-scrum-activity-type.enum';

/**
 * Displays daily scrum part of a tasklet
 */
@Component({
  selector: 'app-tasklet-daily-scrum-fragment',
  templateUrl: './tasklet-daily-scrum-fragment.component.html',
  styleUrls: ['./tasklet-daily-scrum-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletDailyScrumFragmentComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: TaskletDailyScrum;

  /** Enum for daily scrum activity types */
  dailyScrumActivityType = DailyScrumActivityType;
}
