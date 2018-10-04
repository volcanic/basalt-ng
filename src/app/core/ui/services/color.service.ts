import {Injectable} from '@angular/core';
import {Hash} from '../../entity/model/hash';
import {Project} from '../../entity/model/project.model';
import {MaterialColorService} from './material-color.service';
import {HueType} from '../model/hue-type.enum';
import {PaletteType} from '../model/palette-type.enum';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  /** Array of available project colors */
  projectColors = [
    this.materialColorService.color(PaletteType.GREEN, HueType._100),
    this.materialColorService.color(PaletteType.GREEN, HueType._200),
    this.materialColorService.color(PaletteType.GREEN, HueType._300),
    this.materialColorService.color(PaletteType.LIGHT_GREEN, HueType._100),
    this.materialColorService.color(PaletteType.LIGHT_GREEN, HueType._200),
    this.materialColorService.color(PaletteType.LIGHT_GREEN, HueType._300),
    this.materialColorService.color(PaletteType.LIME, HueType._100),
    this.materialColorService.color(PaletteType.LIME, HueType._200),
    this.materialColorService.color(PaletteType.LIME, HueType._300),
  ];

  /**
   * Constructor
   * @param materialColorService material color service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  /**
   * Returns a color picked by a hash value generated from a project's name
   * @param {Project} project project to get color for
   * @returns {string} color string derived from project name
   */
  getProjectColor(project: Project) {
    if (project != null && project.name != null && project.name.trim().length > 0) {
      return this.projectColors[
      Math.abs(Hash.hash(project.name.toLowerCase().replace(' ', ''))) % this.projectColors.length];
    } else {
      return 'transparent';
    }
  }
}
