import {TaskletType} from './tasklet-type.enum';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from './description.model';
import {DailyScrumParticipant} from './daily-scrum-participant';

/**
 * Represents a tasklet which is a fraction of a task
 */
export class Tasklet extends Entity {

  /** Tasklet type */
  type: TaskletType;
  /** Reference to task */
  taskId: string;
  /** Description */
  description: Description;
  /** References to persons */
  personIds: string[];
  /** Array of daily scrum participants */
  participants: DailyScrumParticipant[];
  /** References to tags */
  tagIds: string[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.TASKLET;
    this.type = TaskletType.UNSPECIFIED;
    this.taskId = '';
    this.description = new Description();
    this.personIds = [];
    this.participants = [];
    this.tagIds = [];
  }
}
