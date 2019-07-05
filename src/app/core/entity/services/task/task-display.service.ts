import {Injectable} from '@angular/core';
import {Task} from '../../model/task.model';

/**
 * Enum representing display aspects
 */
export enum TaskDisplayAspect {
  CAN_BE_CREATED,
  CAN_BE_UPDATED,
  CAN_BE_CONTINUED,

  IS_POMODORO_STARTED,
  IS_DISPLAYED_AS_PREVIEW
}

/**
 * Handles tasklet display options
 */
@Injectable({
  providedIn: 'root'
})
export class TaskDisplayService {

  //
  // Helpers
  //

  /**
   * Determines whether a given task can be created
   * @param task task
   */
  static canBeCreated(task: Task): boolean {
    return task.name != null && task.name.length > 0;
  }

  /**
   * Determines whether a given task can be updated
   * @param task task
   */
  static canBeUpdated(task: Task): boolean {
    return task.name != null && task.name.length > 0;
  }
}
