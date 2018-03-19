import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tasklet} from './tasklet.model';
import {DailyScrumParticipant} from './daily-scrum-participant';

export class TaskletDailyScrum extends Tasklet {
  type = TASKLET_TYPE.DAILY_SCRUM;
  participants: DailyScrumParticipant[] = [];
}
