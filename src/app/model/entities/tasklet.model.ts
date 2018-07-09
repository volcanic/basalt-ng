import {TASKLET_TYPE} from '../tasklet-type.enum';
import {Tag} from '../tag.model';
import {Person} from '../person.model';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from '../description.model';
import {DailyScrumParticipant} from '../daily-scrum-participant';

export class Tasklet extends Entity {

  type: TASKLET_TYPE;
  taskId: string;
  description: Description;
  creationDate: Date;
  persons: Person[];
  participants: DailyScrumParticipant[];
  tags: Tag[];

  constructor() {
    super();
    this.entityType = EntityType.TASKLET;
    this.type = TASKLET_TYPE.UNSPECIFIED;
    this.taskId = '';
    this.description = new Description();
    this.creationDate = new Date();
    this.persons = [];
    this.participants = [];
    this.tags = [];
  }
}
