import {TASKLET_TYPE} from '../tasklet-type.enum';
import {Tag} from '../tag.model';
import {Person} from '../person.model';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';

export class Tasklet extends Entity {

  type: TASKLET_TYPE;
  taskId: string;
  text: string;
  creationDate: Date;
  persons: Person[];
  tags: Tag[];

  constructor() {
    super();
    this.entityType = EntityType.TASKLET;
    this.taskId = '';
    this.type = TASKLET_TYPE.UNSPECIFIED;
    this.text = '';
    this.creationDate = new Date();
    this.persons = [];
    this.tags = [];
  }
}
