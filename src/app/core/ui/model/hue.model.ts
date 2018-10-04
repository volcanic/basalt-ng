import {HueType} from './hue-type.enum';

/**
 * Specific hue of a palette containing a color and a corresponding contrast value
 */
export class Hue {

  /** Hue type */
  type: HueType;
  /** Color value */
  color: string;
  /** Contrast value */
  contrast: string;

  /**
   * Constructor
   * @param type hue type
   * @param color color
   * @param contrast contrast
   */
  constructor(type: HueType, color: string, contrast: string) {
    this.type = type;
    this.color = color;
    this.contrast = contrast;
  }
}
