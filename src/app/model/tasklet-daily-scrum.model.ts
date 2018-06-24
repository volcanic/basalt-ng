import {TASKLET_TYPE} from './tasklet-type.enum';
import {DailyScrumParticipant} from './daily-scrum-participant';
import {Tasklet} from './entities/tasklet.model';

export class TaskletDailyScrum extends Tasklet {
  type = TASKLET_TYPE.DAILY_SCRUM;
  participants: DailyScrumParticipant[] = [];
}
