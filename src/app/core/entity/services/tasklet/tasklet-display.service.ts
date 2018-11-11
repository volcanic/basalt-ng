import {Injectable} from '@angular/core';
import {Tasklet} from '../../model/tasklet.model';
import {TaskletType} from '../../model/tasklet-type.enum';
import {Description} from '../../model/description.model';
import {TaskletTypeService} from './tasklet-type.service';
import {TaskletTypeGroup} from '../../model/tasklet-type-group.enum';
import {DateService} from '../date.service';

/**
 * Enum representing display aspects
 */
export enum DisplayAspect {
  CAN_BE_ASSIGNED_TO_TASK,
  CONTAINS_DESCRIPTION,
  CONTAINS_PREVIOUS_DESCRIPTION,
  CONTAINS_MEETING_MINUTES,
  CONTAINS_DAILY_SCRUM,
  CONTAINS_POMODORO_TASK,
  CONTAINS_TAGS,
  CONTAINS_PERSONS,
  CAN_BE_CREATED,
  CAN_BE_UPDATED,
  CAN_BE_CONTINUED,

  IS_DISPLAYED_AS_PREVIEW
}

/**
 * Handles tasklet display options
 */
@Injectable({
  providedIn: 'root'
})
export class TaskletDisplayService {

  /**
   * Constructor
   */
  constructor(private dateService: DateService,
              private taskletTypeService: TaskletTypeService) {
  }

  //
  // Helpers
  //

  /**
   * Determines whether the displayed tasklet contains a description
   * @param tasklet tasklet
   */
  static containsDescription(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.ACTION
      || tasklet.type === TaskletType.POMODORO
      || (tasklet.type === TaskletType.MEETING
        && tasklet.description != null
        && tasklet.description.value != null
        && tasklet.description.value !== '')
      || (tasklet.type === TaskletType.CALL
        && tasklet.description != null
        && tasklet.description.value != null
        && tasklet.description.value !== '')
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.DEVELOPMENT
      || tasklet.type === TaskletType.CODING
      || tasklet.type === TaskletType.DEBUGGING
      || tasklet.type === TaskletType.DOCUMENTATION
      || tasklet.type === TaskletType.REVIEW
      || tasklet.type === TaskletType.TESTING
      || tasklet.type === TaskletType.IDEA);
  }

  /**
   * Determines whether the displayed tasklet contains a previous description
   * @param previousDescription previous description
   */
  static containsPreviousDescription(previousDescription: Description): boolean {
    return previousDescription != null && previousDescription.value !== '';
  }

  /**
   * Determines whether the displayed tasklet contains meeting minutes
   * @param tasklet tasklet
   */
  static containsMeetingMinutes(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CHAT);
  }

  /**
   * Determines whether the displayed tasklet contains daily scrum
   * @param tasklet tasklet
   */
  static containsDailyScrum(tasklet: Tasklet): boolean {
    return tasklet != null && tasklet.type === TaskletType.DAILY_SCRUM;
  }

  /**
   * Determines whether the displayed tasklet contains pomodoro tasks
   * @param tasklet tasklet
   */
  static containsPomodoroTask(tasklet: Tasklet) {
    return tasklet != null && tasklet.type === TaskletType.POMODORO;
  }

  /**
   * Determines whether a given tasklet contains tags
   * @param tasklet tasklet
   */
  static containsTags(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type !== TaskletType.LUNCH_BREAK
      && tasklet.type !== TaskletType.POMODORO_BREAK
      && tasklet.type !== TaskletType.TRAVEL
      && tasklet.type !== TaskletType.COMMUTE
      && tasklet.type !== TaskletType.FINISHING_TIME
      && tasklet.type !== TaskletType.UNSPECIFIED);
  }

  /**
   * Determines whether a given tasklet contains persons
   * @param tasklet tasklet
   */
  static containsPersons(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT);
  }

  /**
   * Determines whether a given tasklet can be created
   * @param tasklet tasklet
   */
  static canBeCreated(tasklet: Tasklet): boolean {
    return tasklet.type !== TaskletType.UNSPECIFIED;
  }

  /**
   * Determines whether a given tasklet can be updated
   * @param tasklet tasklet
   */
  static canBeUpdated(tasklet: Tasklet): boolean {
    return tasklet != null
      && tasklet.type !== TaskletType.LUNCH_BREAK
      && tasklet.type !== TaskletType.FINISHING_TIME;
  }

  /**
   * Determines whether a given tasklet can be continued
   */
  static canBeContinued(tasklet: Tasklet): boolean {
    return tasklet.type === TaskletType.ACTION
      || tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.DAILY_SCRUM
      || tasklet.type === TaskletType.DEVELOPMENT
      || tasklet.type === TaskletType.DEBUGGING
      || tasklet.type === TaskletType.IDEA;
  }

  /**
   * Determines whether a given tasklet can be templated
   */
  static canBeTemplated(tasklet: Tasklet): boolean {
    return tasklet.type === TaskletType.DAILY_SCRUM;
  }

  /**
   * Determines whether the displayed tasklet can be assigned to a task
   * @param tasklet tasklet
   */
  canBeAssignedToTask(tasklet: Tasklet): boolean {
    const group = this.taskletTypeService.taskletTypeGroups.get(tasklet.type);

    return tasklet != null
      && group !== null
      && group !== TaskletTypeGroup.BREAK
      && tasklet.type !== TaskletType.UNSPECIFIED
      && tasklet.type !== TaskletType.DAILY_SCRUM;
  }

  /**
   * Determines whether a given tasklet shall be displayed as a preview
   * @param tasklet tasklet
   */
  isDisplayedAsPreview(tasklet: Tasklet): boolean {
    const group = this.taskletTypeService.taskletTypeGroups.get(tasklet.type);

    return tasklet != null
      && ((group != null && group === TaskletTypeGroup.BREAK)
        || !DateService.isBeforeNow(tasklet.creationDate));
  }
}
