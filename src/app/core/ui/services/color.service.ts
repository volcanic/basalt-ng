import {Injectable} from '@angular/core';
import {Hash} from '../../entity/model/hash';
import {Project} from '../../entity/model/project.model';
import {Hue, MaterialColorService, Palette} from './material-color.service';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  /** Array of available project colors */
  static projectColors = [
    MaterialColorService.color(Palette.GREEN, Hue._100),
    MaterialColorService.color(Palette.GREEN, Hue._200),
    MaterialColorService.color(Palette.GREEN, Hue._300),
    MaterialColorService.color(Palette.LIGHT_GREEN, Hue._100),
    MaterialColorService.color(Palette.LIGHT_GREEN, Hue._200),
    MaterialColorService.color(Palette.LIGHT_GREEN, Hue._300),
    MaterialColorService.color(Palette.LIME, Hue._100),
    MaterialColorService.color(Palette.LIME, Hue._200),
    MaterialColorService.color(Palette.LIME, Hue._300),
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
