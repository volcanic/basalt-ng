import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from './description.model';
import {RecurrenceInterval} from './recurrence-interval.enum';
import {AcceptanceCriterium} from './acceptance-criterium.model';

/**
 * Represents a task
 */
export class Task extends Entity {

  /** Name */
  name: string;
  /** Description */
  description: Description;
  /** Definition of Done */
  acceptanceCriteria: AcceptanceCriterium[];
  /** Reference to project */
  projectId: string;
  /** Due date */
  dueDate: Date;
  /** Completion date */
  completionDate: Date;
  /** Priority */
  priority: number;
  /** Effort in minutes */
  effort: number;
  /** References to tags */
  tagIds: string[];
  /** Recurrence interval */
  recurrenceInterval: RecurrenceInterval;
  /** Reference to person */
  delegatedToId: string;

  /** Whether this task is a proxy for the project it is associated to */
  proxy: boolean;

  /**
   * Constructor
   * @param name name of the task
   */
  constructor(name: string = '') {
    super();
    this.entityType = EntityType.TASK;
    this.name = name.trim();
    this.description = new Description();
    this.acceptanceCriteria = [];
    this.projectId = null;
    this.dueDate = null;
    this.completionDate = null;
    this.priority = 1;
    this.effort = 0;
    this.tagIds = [];
    this.recurrenceInterval = RecurrenceInterval.NONE;
    this.delegatedToId = null;

    this.proxy = false;
  }
}
