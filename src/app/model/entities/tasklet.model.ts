import {TASKLET_TYPE} from '../tasklet-type.enum';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from './fragments/description.model';
import {DailyScrumParticipant} from './scrum/daily-scrum-participant';

export class Tasklet extends Entity {

  type: TASKLET_TYPE;
  taskId: string;
  description: Description;
  personIds: string[];
  participants: DailyScrumParticipant[];
  tagIds: string[];

  constructor() {
    super();
    this.entityType = EntityType.TASKLET;
    this.type = TASKLET_TYPE.UNSPECIFIED;
    this.taskId = '';
    this.description = new Description();
    this.personIds = [];
    this.participants = [];
    this.tagIds = [];
  }
}
