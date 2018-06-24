import {TASKLET_PRIORITY} from '../tasklet-priority.enum';
import {Tag} from '../tag.model';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';

export class Task extends Entity {

  projectId: string;
  name: string;
  description: string;
  creationDate: Date;
  dueDate: Date;
  completionDate: Date;
  priority: TASKLET_PRIORITY;
  tags: Tag[];

  constructor(name: string, description: string) {
    super();
    this.entityType = EntityType.TASK;
    this.projectId = '';
    this.creationDate = new Date();
    this.dueDate = null;
    this.completionDate = null;
    this.priority = TASKLET_PRIORITY.UNSPECIFIED;
    this.tags = [];
  }
}
