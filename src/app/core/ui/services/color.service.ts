import {Injectable} from '@angular/core';
import {Hash} from '../../entity/model/hash';
import {Project} from '../../entity/model/project.model';
import {Task} from '../../entity/model/task.model';
import {MaterialColorService} from './material-color.service';
import {HueType} from '../model/hue-type.enum';
import {PaletteType} from '../model/palette-type.enum';
import {Person} from '../../entity/model/person.model';
import {TaskletTypeGroup} from '../../entity/model/tasklet-type-group.enum';
import {Hue} from '../model/hue.model';
import {FeatureType} from '../../settings/model/feature-type.enum';
import {DateService} from '../../entity/services/date.service';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  /** Array of available task colors */
  taskHues = [
    this.materialColorService.hue(PaletteType.TEAL, HueType._500),
    this.materialColorService.hue(PaletteType.TEAL, HueType._600),
    this.materialColorService.hue(PaletteType.TEAL, HueType._700),
    this.materialColorService.hue(PaletteType.TEAL, HueType._800),
    this.materialColorService.hue(PaletteType.TEAL, HueType._900),

  ];

  /** Array of available task colors */
  taskUrgentHues = [
    this.materialColorService.hue(PaletteType.ORANGE, HueType._500),
    this.materialColorService.hue(PaletteType.ORANGE, HueType._600),
    this.materialColorService.hue(PaletteType.ORANGE, HueType._700),
    this.materialColorService.hue(PaletteType.ORANGE, HueType._800),
    this.materialColorService.hue(PaletteType.ORANGE, HueType._900),
  ];

  /** Array of available task colors */
  taskOverdueHues = [
    this.materialColorService.hue(PaletteType.RED, HueType._500),
    this.materialColorService.hue(PaletteType.RED, HueType._600),
    this.materialColorService.hue(PaletteType.RED, HueType._700),
    this.materialColorService.hue(PaletteType.RED, HueType._800),
    this.materialColorService.hue(PaletteType.RED, HueType._900),
  ];

  /** Array of available task colors */
  taskRecurringHues = [
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._500),
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._600),
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._700),
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._800),
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._900),
  ];

  /** Array of available project colors */
  projectHues = [
    this.materialColorService.hue(PaletteType.TEAL, HueType._100),
    this.materialColorService.hue(PaletteType.TEAL, HueType._200),
    this.materialColorService.hue(PaletteType.TEAL, HueType._300),
    this.materialColorService.hue(PaletteType.GREEN, HueType._100),
    this.materialColorService.hue(PaletteType.GREEN, HueType._200),
    this.materialColorService.hue(PaletteType.GREEN, HueType._300),
    this.materialColorService.hue(PaletteType.LIGHT_GREEN, HueType._100),
    this.materialColorService.hue(PaletteType.LIGHT_GREEN, HueType._200),
    this.materialColorService.hue(PaletteType.LIGHT_GREEN, HueType._300),
    this.materialColorService.hue(PaletteType.LIME, HueType._100),
    this.materialColorService.hue(PaletteType.LIME, HueType._200),
    this.materialColorService.hue(PaletteType.LIME, HueType._300),
  ];

  /** Array of available person colors */
  personHues = [
    this.materialColorService.hue(PaletteType.RED, HueType._500),
    this.materialColorService.hue(PaletteType.PINK, HueType._500),
    this.materialColorService.hue(PaletteType.PURPLE, HueType._500),
    this.materialColorService.hue(PaletteType.DEEP_PURPLE, HueType._500),
    this.materialColorService.hue(PaletteType.INDIGO, HueType._500),
    this.materialColorService.hue(PaletteType.BLUE, HueType._500),
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._500),
    this.materialColorService.hue(PaletteType.CYAN, HueType._500),
    this.materialColorService.hue(PaletteType.TEAL, HueType._500),
    this.materialColorService.hue(PaletteType.GREEN, HueType._500),
    this.materialColorService.hue(PaletteType.LIGHT_GREEN, HueType._500),
    this.materialColorService.hue(PaletteType.LIME, HueType._500),
    this.materialColorService.hue(PaletteType.YELLOW, HueType._500),
    this.materialColorService.hue(PaletteType.AMBER, HueType._500),
    this.materialColorService.hue(PaletteType.ORANGE, HueType._500),
    this.materialColorService.hue(PaletteType.DEEP_ORANGE, HueType._500),
  ];

  /**
   * Constructor
   * @param materialColorService material personColor service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  /**
   * Determines a task's color
   * @param {Task} task task to get color for
   * @returns {string} color string derived from task name
   */
  getTaskColor(task: Task) {
    const hue = this.getTaskHue(task);

    return (hue != null) ? hue.color : this.materialColorService.color(PaletteType.GREY, HueType._500);
  }

  /**
   * Determines a task's contrast
   * @param {Task} task task to get color for
   * @returns {string} contrast color string derived from task name
   */
  getTaskContrast(task: Task) {
    const hue = this.getTaskHue(task);

    return (hue != null) ? hue.contrast : this.materialColorService.contrast(PaletteType.GREY, HueType._500);
  }

  /**
   * Returns a hue picked by a hash value generated from a task's name
   * @param task task
   */
  private getTaskHue(task: Task): Hue {
    if (task == null || task.name == null || task.name.trim().length <= 0) {
      return null;
    }

    if (task.dueDate == null || DateService.isAfter(task.dueDate, DateService.addDays(new Date(), 1))) {
      const index = Math.abs(Hash.hash(task.name.toLowerCase().replace(' ', ''))) % this.taskHues.length;
      return this.taskHues[index];
    } else {
      // Due date is in less than a day
      const index = Math.abs(Hash.hash(task.name.toLowerCase().replace(' ', ''))) % this.taskUrgentHues.length;
      return this.taskUrgentHues[index];
    }
  }

  /**
   * Determines a task's overdue color
   * @param {Task} task task to get color for
   * @returns {string} color string derived from task name
   */
  getTaskOverdueColor(task: Task) {
    const hue = this.getTaskOverdueHue(task);

    return (hue != null) ? hue.color : this.materialColorService.color(PaletteType.GREY, HueType._500);
  }

  /**
   * Determines a task's overdue contrast
   * @param {Task} task task to get color for
   * @returns {string} contrast color string derived from task name
   */
  getTaskOverdueContrast(task: Task) {
    const hue = this.getTaskOverdueHue(task);

    return (hue != null) ? hue.contrast : this.materialColorService.contrast(PaletteType.GREY, HueType._500);
  }

  /**
   * Returns a hue picked by a hash value generated from a task's name
   * @param task task
   */
  private getTaskOverdueHue(task: Task): Hue {
    if (task == null || task.name == null || task.name.trim().length <= 0) {
      return null;
    }

    return this.taskOverdueHues[
    Math.abs(Hash.hash(task.name.toLowerCase().replace(' ', ''))) % this.taskHues.length];
  }

  /**
   * Determines a task's recurring color
   * @param {Task} task task to get color for
   * @returns {string} color string derived from task name
   */
  getTaskRecurringColor(task: Task) {
    const hue = this.getTaskRecurringHue(task);

    return (hue != null) ? hue.color : this.materialColorService.color(PaletteType.GREY, HueType._500);
  }

  /**
   * Determines a task's recurring contrast
   * @param {Task} task task to get color for
   * @returns {string} contrast color string derived from task name
   */
  getTaskRecurringContrast(task: Task) {
    const hue = this.getTaskRecurringHue(task);

    return (hue != null) ? hue.contrast : this.materialColorService.contrast(PaletteType.GREY, HueType._500);
  }

  /**
   * Returns a hue picked by a hash value generated from a task's name
   * @param task task
   */
  private getTaskRecurringHue(task: Task): Hue {
    if (task == null || task.name == null || task.name.trim().length <= 0) {
      return null;
    }

    return this.taskRecurringHues[
    Math.abs(Hash.hash(task.name.toLowerCase().replace(' ', ''))) % this.taskHues.length];
  }

  /**
   * Determines a project's color
   * @param {Project} project project to get color for
   * @returns {string} color string derived from project name
   */
  getProjectColor(project: Project) {
    const hue = this.getProjectHue(project);

    return (hue != null) ? hue.color : this.materialColorService.color(PaletteType.GREY, HueType._500);
  }

  /**
   * Determines a project's contrast
   * @param {Project} project project to get color for
   * @returns {string} contrast color string derived from project name
   */
  getProjectContrast(project: Project) {
    const hue = this.getProjectHue(project);

    return (hue != null) ? hue.contrast : this.materialColorService.contrast(PaletteType.GREY, HueType._500);
  }

  /**
   * Returns a hue picked by a hash value generated from a project's name
   * @param project project
   */
  private getProjectHue(project: Project): Hue {
    if (project == null || project.name == null || project.name.trim().length <= 0) {
      return null;
    }

    return this.projectHues[
    Math.abs(Hash.hash(project.name.toLowerCase().replace(' ', ''))) % this.projectHues.length];
  }

  /**
   * Determines a persons's color
   * @param {Person} person person to get color for
   * @returns {string} color string derived from project name
   */
  getPersonColor(person: Person) {
    const hue = this.getPersonHue(person);

    return (hue != null) ? hue.color : 'transparent';
  }

  /**
   * Determines a persons's contrast
   * @param {Person} person person to get contrast for
   * @returns {string} contrast color string derived from project name
   */
  getPersonContrast(person: Person) {
    const hue = this.getPersonHue(person);

    return (hue != null) ? hue.contrast : 'transparent';
  }

  /**
   * Returns a hue picked by a hash value generated from a person's name
   * @param person person
   */
  private getPersonHue(person: Person): Hue {
    if (person == null || person.name == null || person.name.trim().length <= 0) {
      return null;
    }

    return this.personHues[
    Math.abs(Hash.hash(person.name.toLowerCase().replace(' ', ''))) % this.personHues.length];
  }

  /**
   * Returns a color associated to tasklet type group
   * @param {TaskletTypeGroup} group tasklet type group
   */
  getTaskletTypeGroupColor(group: TaskletTypeGroup): Hue {
    switch (group) {
      case TaskletTypeGroup.UNSPECIFIED: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._50);
      }
      case TaskletTypeGroup.ACTION: {
        return this.materialColorService.hue(PaletteType.RED, HueType._600);
      }
      case TaskletTypeGroup.COMMUNICATION: {
        return this.materialColorService.hue(PaletteType.LIME, HueType._600);
      }
      case TaskletTypeGroup.DEVELOPMENT: {
        return this.materialColorService.hue(PaletteType.CYAN, HueType._700);
      }
      case TaskletTypeGroup.ROUTINE: {
        return this.materialColorService.hue(PaletteType.ORANGE, HueType._600);
      }
      case TaskletTypeGroup.IDEA: {
        return this.materialColorService.hue(PaletteType.AMBER, HueType._600);
      }
      case TaskletTypeGroup.TRAVEL: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._600);
      }
      case TaskletTypeGroup.BREAK: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._600);
      }
      default: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._300);
      }
    }
  }

  /**
   * Returns a color associated to a feature
   * @param feature feature
   */
  getFeatureTypeColor(feature: FeatureType): Hue {
    switch (feature) {
      case FeatureType.DEVELOPMENT: {
        return this.materialColorService.hue(PaletteType.CYAN, HueType._700);
      }
      case FeatureType.SCRUM: {
        return this.materialColorService.hue(PaletteType.LIME, HueType._600);
      }
      case FeatureType.POMODORO: {
        return this.materialColorService.hue(PaletteType.RED, HueType._600);
      }
      default: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._300);
      }
    }
  }
}
