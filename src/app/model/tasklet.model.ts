import {TASKLET_TYPE} from './tasklet-type.enum';

export class Tasklet {
  id = '';
  type = TASKLET_TYPE.UNSPECIFIED;
  text = '';
  creationDate: Date;
}
