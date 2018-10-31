import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from './description.model';
import {RecurrenceInterval} from './recurrence-interval.enum';

/**
 * Represents a task
 */
export class Task extends Entity {

  /** Name */
  name: string;
  /** Description */
  description: Description;
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

  /** Whether task is checked in filter mechanism */
  checked: boolean;

  /**
   * Constructor
   * @param {string} name name of the task
   * @param {boolean} checked whether task is checked in filter mechanism
   */
  constructor(name: string, checked: boolean = false) {
    super();
    this.entityType = EntityType.TASK;
    this.name = name.trim();
    this.description = new Description();
    this.projectId = null;
    this.dueDate = null;
    this.completionDate = null;
    this.priority = 4;
    this.effort = 0;
    this.tagIds = [];
    this.recurrenceInterval = RecurrenceInterval.NONE;
    this.delegatedToId = null;

    this.checked = checked;
  }
}
