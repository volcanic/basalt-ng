import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tasklet} from './tasklet.model';
import {Person} from './person.model';

export class TaskletCall extends Tasklet {
  type = TASKLET_TYPE.CALL;
  persons: Person[] = [];
}
