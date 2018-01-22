import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tasklet} from './tasklet.model';
import {TASKLET_PRIORITY} from './tasklet-priority.enum';

export class TaskletTodo extends Tasklet {
  type = TASKLET_TYPE.TODO;
  dueDate: Date;
  completionDate: Date;
  priority: TASKLET_PRIORITY.UNSPECIFIED;
  done = false;
}
