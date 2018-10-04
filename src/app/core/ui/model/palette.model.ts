import {Hue} from './hue.model';
import {PaletteType} from './palette-type.enum';

/**
 * Palette of different hues
 */
export class Palette {

  /** Palette type */
  type: PaletteType;
  /** List of hues */
  hues: Hue[] = [];

  /**
   * Constructor
   * @param type palette type
   */
  constructor(type: PaletteType) {
    this.type = type;
  }
}
