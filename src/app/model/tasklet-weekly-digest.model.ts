import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tasklet} from './entities/tasklet.model';

export class TaskletWeeklyDigest extends Tasklet {
  type = TASKLET_TYPE.WEEKLY_DIGEST;
  focusDate: Date;
}
