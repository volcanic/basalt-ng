import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from './fragments/description.model';

export class Task extends Entity {

  name: string;
  description: Description;
  projectId: string;
  dueDate: Date;
  completionDate: Date;
  priority: number;
  effort: number;
  tagIds: string[];

  constructor(name: string) {
    super();
    this.entityType = EntityType.TASK;
    this.name = name;
    this.description = new Description();
    this.projectId = '';
    this.dueDate = null;
    this.completionDate = null;
    this.priority = -1;
    this.effort = 0;
    this.tagIds = [];
  }
}
