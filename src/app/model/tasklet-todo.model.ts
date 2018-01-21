import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tasklet} from './tasklet.model';

export class TaskletTodo extends Tasklet {
  type = TASKLET_TYPE.TODO;
  dueDate: Date;
  completionDate: Date;
  priority: 0;
  done = false;
}
