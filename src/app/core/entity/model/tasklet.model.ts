import {TaskletType} from './tasklet-type.enum';
import {EntityType} from './entity-type.enum';
import {Entity} from './entity.model';
import {Description} from './description.model';
import {MeetingMinuteItem} from './meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from './daily-scrum/daily-scrum-item.model';

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

  // Labels

  /** References to tags */
  tagIds: string[];
  /** References to persons */
  personIds: string[];

  // Type specific aspects

  /** Array of meeting minute items */
  meetingMinuteItems: MeetingMinuteItem[];
  /** Array of daily scrum items */
  dailyScrumItems: DailyScrumItem[];
  /** Pomodoro task */
  pomodoroTask: Description;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.TASKLET;
    this.type = TaskletType.UNSPECIFIED;
    this.taskId = '';
    this.description = new Description();
    this.tagIds = [];
    this.personIds = [];

    this.meetingMinuteItems = [];
    this.dailyScrumItems = [];
    this.pomodoroTask = new Description();
  }
}
