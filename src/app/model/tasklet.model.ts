import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tag} from './tag.model';
import {Person} from './person.model';

export class Tasklet {
  id = '';
  type = TASKLET_TYPE.UNSPECIFIED;
  taskName = '';
  text = '';
  creationDate: Date;
  persons: Person[] = [];
  tags: Tag[] = [];
}
