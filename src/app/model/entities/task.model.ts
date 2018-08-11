import {Tag} from '../tag.model';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from '../description.model';
import {Scope} from '../scope.enum';

export class Task extends Entity {

  name: string;
  scope: Scope;
  description: Description;
  projectId: string;
  dueDate: Date;
  completionDate: Date;
  priority: number;
  effort: number;
  tags: Tag[];

  constructor(name: string) {
    super();
    this.entityType = EntityType.TASK;
    this.name = name;
    this.scope = Scope.UNDEFINED;
    this.description = new Description();
    this.projectId = '';
    this.dueDate = null;
    this.completionDate = null;
    this.priority = -1;
    this.effort = 0;
    this.tags = [];
  }
}
