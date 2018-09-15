import {TaskletType} from './tasklet-type.enum';
import {DailyScrumParticipant} from './daily-scrum-participant';
import {Tasklet} from './tasklet.model';

/**
 * Represents a daily scrum event which is a special type of tasklet
 */
export class TaskletDailyScrum extends Tasklet {

  /** Tasklet type */
  type = TaskletType.DAILY_SCRUM;
  /** Array of participants in daily scrum */
  participants: DailyScrumParticipant[] = [];
}
