import {TASKLET_TYPE} from './tasklet-type.enum';
import {Tag} from './tag.model';
import {Person} from './person.model';
import {Project} from './project.model';

export class Tasklet {
  id = '';
  type = TASKLET_TYPE.UNSPECIFIED;
  project: Project = null;
  taskName = '';
  text = '';
  creationDate: Date;
  persons: Person[] = [];
  tags: Tag[] = [];
}
