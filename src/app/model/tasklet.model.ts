import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tag} from './tag.model';

export class Tasklet {
  id = '';
  type = TASKLET_TYPE.UNSPECIFIED;
  taskName = '';
  text = '';
  creationDate: Date;
  tags: Tag[] = [];
}
