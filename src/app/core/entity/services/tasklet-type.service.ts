import {Injectable} from '@angular/core';
import {TaskletTypeGroup} from '../model/tasklet-type-group.enum';
import {TaskletType} from '../model/tasklet-type.enum';

/**
 * Handles tasklet type hierarchy
 */
@Injectable({
  providedIn: 'root'
})
export class TaskletTypeService {

  /** Map of tasklet types and type groups */
  taskletTypeGroups = new Map<TaskletType, TaskletTypeGroup>();

  /**
   * Constructor
   */
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
    const groups = Object.keys(TaskletTypeGroup).map(key => TaskletTypeGroup[key]);

    groups.forEach(group => {
      switch (group) {
        case TaskletTypeGroup.UNSPECIFIED: {
          this.taskletTypeGroups.set(TaskletType.UNSPECIFIED, group);
          break;
        }
        case TaskletTypeGroup.ACTION: {
          this.taskletTypeGroups.set(TaskletType.ACTION, group);
          this.taskletTypeGroups.set(TaskletType.POMODORO, group);
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
        case TaskletTypeGroup.DEVELOPMENT: {
          this.taskletTypeGroups.set(TaskletType.CODING, group);
          this.taskletTypeGroups.set(TaskletType.DEBUGGING, group);
          this.taskletTypeGroups.set(TaskletType.DOCUMENTATION, group);
          this.taskletTypeGroups.set(TaskletType.REVIEW, group);
          this.taskletTypeGroups.set(TaskletType.TESTING, group);
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
   * Returns the tasklet type group of a given tasklet type
   * @param type tasklet type
   */
  public getTaskletGroupByType(type: TaskletType): TaskletTypeGroup {
    return this.taskletTypeGroups.get(type);
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
  public getIconByTaskletTypeGroup(group: TaskletTypeGroup): string {
    switch (group) {
      case TaskletTypeGroup.UNSPECIFIED: {
        return 'help';
      }
      case TaskletTypeGroup.ACTION: {
        return 'turned_in_not';
      }
      case TaskletTypeGroup.COMMUNICATION: {
        return 'chat';
      }
      case TaskletTypeGroup.DEVELOPMENT: {
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
  public getIconByTaskletType(type: TaskletType): string {
    switch (type) {
      case TaskletType.UNSPECIFIED: {
        return 'help';
      }
      case TaskletType.ACTION: {
        return 'turned_in_not';
      }
      case TaskletType.POMODORO: {
        return 'clock_end';
      }
      case TaskletType.CALL: {
        return 'call';
      }
      case TaskletType.MEETING: {
        return 'people';
      }
      case TaskletType.MAIL: {
        return 'mail';
      }
      case TaskletType.CHAT: {
        return 'chat';
      }
      case TaskletType.DAILY_SCRUM: {
        return 'scrum';
      }
      case TaskletType.CODING:
      case TaskletType.DEVELOPMENT: {
        return 'code';
      }
      case TaskletType.DEBUGGING: {
        return 'bug_report';
      }
      case TaskletType.DOCUMENTATION: {
        return 'file_document_outline';
      }
      case TaskletType.REVIEW: {
        return 'code_tags_check';
      }
      case TaskletType.TESTING: {
        return 'test_tube';
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
