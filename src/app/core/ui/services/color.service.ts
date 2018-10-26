import {Injectable} from '@angular/core';
import {Hash} from '../../entity/model/hash';
import {Project} from '../../entity/model/project.model';
import {MaterialColorService} from './material-color.service';
import {HueType} from '../model/hue-type.enum';
import {PaletteType} from '../model/palette-type.enum';
import {Person} from '../../entity/model/person.model';
import {TaskletTypeGroup} from '../../entity/model/tasklet-type-group.enum';
import {Hue} from '../model/hue.model';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  /** Array of available project colors */
  projectHues = [
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
   * Returns a personColor picked by a hash value generated from a project's name
   * @param {Project} project project to get personColor for
   * @returns {string} personColor string derived from project name
   */
  getProjectColor(project: Project) {
    if (project == null || project.name == null || project.name.trim().length <= 0) {
      return 'transparent';
    }
    const hue = this.projectHues[
    Math.abs(Hash.hash(project.name.toLowerCase().replace(' ', ''))) % this.projectHues.length];

    if (hue == null) {
      return 'transparent';
    }

    return hue.color;
  }

  /**
   * Returns a color picked by a hash value generated from a person's name
   * @param {Person} person person to get personColor for
   * @returns {string} personColor string derived from project name
   */
  getPersonColor(person: Person) {
    if (person == null || person.name == null || person.name.trim().length <= 0) {
      return 'transparent';
    }
    const hue = this.personHues[
    Math.abs(Hash.hash(person.name.toLowerCase().replace(' ', ''))) % this.personHues.length];

    if (hue == null) {
      return 'transparent';
    }

    return hue.color;
  }

  /**
   * Returns a contrast picked by a hash value generated from a person's name
   * @param {Person} person person to get personColor for
   * @returns {string} contrast personColor string derived from project name
   */
  getPersonContrast(person: Person) {
    if (person == null || person.name == null || person.name.trim().length <= 0) {
      return 'transparent';
    }
    const hue = this.personHues[
    Math.abs(Hash.hash(person.name.toLowerCase().replace(' ', ''))) % this.personHues.length];

    if (hue == null) {
      return 'transparent';
    }

    return hue.contrast;
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
      case TaskletTypeGroup.IDEA: {
        return this.materialColorService.hue(PaletteType.AMBER, HueType._600);
      }
      case TaskletTypeGroup.BREAK: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._600);
      }
      default: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._300);
      }
    }
  }
}
