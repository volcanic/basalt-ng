import {Injectable} from '@angular/core';
import {Hash} from '../../entity/model/hash';
import {Project} from '../../entity/model/project.model';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  /** Array of available project colors */
  static projectColors = [
    '#C8E6C9',
    '#A5D6A7',
    '#81C784',
    '#DCEDC8',
    '#C5E1A5',
    '#AED581',
    '#F0F4C3',
    '#E6EE9C',
    '#DCE775'
  ];

  /**
   * Returns a color picked by a hash value generated from a project's name
   * @param {Project} project project to get color for
   * @returns {string} color string derived from project name
   */
  static getProjectColor(project: Project) {
    if (project != null && project.name != null && project.name.trim().length > 0) {
      return this.projectColors[
      Math.abs(Hash.hash(project.name.toLowerCase().replace(' ', ''))) % this.projectColors.length];
    } else {
      return 'transparent';
    }
  }
}
