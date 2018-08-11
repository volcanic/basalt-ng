import {TASKLET_TYPE} from '../tasklet-type.enum';
import {Tag} from '../tag.model';
import {Person} from '../person.model';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from '../description.model';
import {DailyScrumParticipant} from '../daily-scrum-participant';
import {Scope} from '../scope.enum';

export class Tasklet extends Entity {

  type: TASKLET_TYPE;
  scope: Scope;
  taskId: string;
  description: Description;
  persons: Person[];
  participants: DailyScrumParticipant[];
  tags: Tag[];

  constructor() {
    super();
    this.entityType = EntityType.TASKLET;
    this.scope = Scope.UNDEFINED;
    this.type = TASKLET_TYPE.UNSPECIFIED;
    this.taskId = '';
    this.description = new Description();
    this.persons = [];
    this.participants = [];
    this.tags = [];
  }
}
