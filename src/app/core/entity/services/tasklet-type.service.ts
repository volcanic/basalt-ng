import {Injectable} from '@angular/core';
import {TaskletTypeGroup} from '../model/tasklet-type-group.enum';
import {TaskletType} from '../model/tasklet-type.enum';

/**
 * Handles tasklets type hierarchy
 */
@Injectable({
  providedIn: 'root'
})
export class TaskletTypeService {

  /** Map of tasklet types and type groups */
  taskletTypeGroups = new Map<TaskletType, TaskletTypeGroup>();

  constructor() {
    this.initializeTaskletTypeHierarchy();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklet type hierarchy
   */
  private initializeTaskletTypeHierarchy() {

    /** Available tasklet type groups */
    const groups = Object.keys(TaskletTypeGroup).map(key => TaskletTypeGroup[key]);

    groups.forEach(group => {
      switch (group) {
        case TaskletTypeGroup.ACTION: {
          this.taskletTypeGroups.set(TaskletType.ACTION, group);
          break;
        }
        case TaskletTypeGroup.COMMUNICATION: {
          this.taskletTypeGroups.set(TaskletType.CALL, group);
          this.taskletTypeGroups.set(TaskletType.MEETING, group);
          this.taskletTypeGroups.set(TaskletType.MAIL, group);
          this.taskletTypeGroups.set(TaskletType.CHAT, group);
          this.taskletTypeGroups.set(TaskletType.DAILY_SCRUM, group);
          break;
        }
        case TaskletTypeGroup.CODING: {
          this.taskletTypeGroups.set(TaskletType.DEVELOPMENT, group);
          this.taskletTypeGroups.set(TaskletType.DEBUGGING, group);
          break;
        }
        case TaskletTypeGroup.IDEA: {
          this.taskletTypeGroups.set(TaskletType.IDEA, group);
          break;
        }
        case TaskletTypeGroup.BREAK: {
          this.taskletTypeGroups.set(TaskletType.LUNCH_BREAK, group);
          this.taskletTypeGroups.set(TaskletType.FINISHING_TIME, group);
          break;
        }
      }
    });
  }

  //
  // Lookup
  //

  /**
   * Returns a list of tasklet types contained in a given tasklet type group
   * @param group tasklet type group
   */
  public getTaskletTypesByGroup(group: TaskletTypeGroup): TaskletType[] {
    const types: TaskletType[] = [];

    this.taskletTypeGroups.forEach((g: TaskletTypeGroup, t: TaskletType) => {
      if (g === group) {
        types.push(t);
      }
    });

    return types;
  }

  /**
   * Determines if a tasklet type group contains a given tasklet type
   * @param group tasklet type group
   * @param type tasklet type
   */
  public groupContainsType(group: TaskletTypeGroup, type: TaskletType) {
    return this.taskletTypeGroups.get(type) === group;
  }

  /**
   * Retrieves an icon by tasklet type
   * @param group tasklet type group
   */
  public getIconByTaskletTypeGroup(group: TaskletTypeGroup) {
    switch (group) {
      case TaskletTypeGroup.ACTION: {
        return 'turned_in_not';
      }
      case TaskletTypeGroup.COMMUNICATION: {
        return 'chat';
      }
      case TaskletTypeGroup.CODING: {
        return 'code_braces';
      }
      case TaskletTypeGroup.IDEA: {
        return 'lightbulb_outline';
      }
      case TaskletTypeGroup.BREAK: {
        return 'local_cafe';
      }
    }
  }

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  public getIconByTaskletType(type: TaskletType) {
    switch (type) {
      case TaskletType.ACTION: {
        return 'turned_in_not';
      }
      case TaskletType.MEETING: {
        return 'people';
      }
      case TaskletType.CALL: {
        return 'call';
      }
      case TaskletType.DAILY_SCRUM: {
        return 'scrum';
      }
      case TaskletType.MAIL: {
        return 'mail';
      }
      case TaskletType.CHAT: {
        return 'chat';
      }
      case TaskletType.DEVELOPMENT: {
        return 'code';
      }
      case TaskletType.DEBUGGING: {
        return 'bug_report';
      }
      case TaskletType.IDEA: {
        return 'lightbulb_outline';
      }
      case TaskletType.LUNCH_BREAK: {
        return 'local_dining';
      }
      case TaskletType.FINISHING_TIME: {
        return 'directions_run';
      }
    }
  }
}
