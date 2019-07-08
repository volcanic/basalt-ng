import {Injectable} from '@angular/core';
import {Palette} from '../model/palette.model';
import {PaletteType} from '../model/palette-type.enum';
import {HueType} from '../model/hue-type.enum';
import {Hue} from '../model/hue.model';

/**
 * Handles Material colors
 */
@Injectable({
  providedIn: 'root'
})
export class MaterialColorService {

  /** Light primary text color */
  static LIGHT_PRIMARY_TEXT = '#FFFFFF';
  /** Dark primary text color */
  static DARK_PRIMARY_TEXT = '#000000';

  /** List of palettes */
  palettes: Palette[] = [];

  /**
   * Constructor
   */
  constructor() {
    this.initializeColors();
  }

  //
  // Initialization
  //

  /**
   * Initializes colors
   */
  public initializeColors() {
    // Red
    const red = new Palette(PaletteType.RED);
    red.hues.push(new Hue(HueType._50, '#ffcdd2', MaterialColorService.DARK_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._100, '#ef9a9a', MaterialColorService.DARK_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._200, '#e57373', MaterialColorService.DARK_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._300, '#e57373', MaterialColorService.DARK_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._400, '#ef5350', MaterialColorService.DARK_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._500, '#f44336', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._600, '#e53935', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._700, '#d32f2f', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._800, '#c62828', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType._900, '#b71c1c', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType.A100, '#ff8a80', MaterialColorService.DARK_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType.A200, '#ff5252', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType.A400, '#ff1744', MaterialColorService.LIGHT_PRIMARY_TEXT));
    red.hues.push(new Hue(HueType.A700, '#d50000', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(red);

    // Pink
    const pink = new Palette(PaletteType.PINK);
    pink.hues.push(new Hue(HueType._50, '#fce4ec', MaterialColorService.DARK_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._100, '#f8bbd0', MaterialColorService.DARK_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._200, '#f48fb1', MaterialColorService.DARK_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._300, '#f06292', MaterialColorService.DARK_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._400, '#ec407a', MaterialColorService.DARK_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._500, '#e91e63', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._600, '#d81b60', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._700, '#c2185b', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._800, '#ad1457', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType._900, '#880e4f', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType.A100, '#ff80ab', MaterialColorService.DARK_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType.A200, '#ff4081', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType.A400, '#f50057', MaterialColorService.LIGHT_PRIMARY_TEXT));
    pink.hues.push(new Hue(HueType.A700, '#c51162', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(pink);

    // Purple
    const purple = new Palette(PaletteType.PURPLE);
    purple.hues.push(new Hue(HueType._50, '#f3e5f5', MaterialColorService.DARK_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._100, '#e1bee7', MaterialColorService.DARK_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._200, '#ce93d8', MaterialColorService.DARK_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._300, '#ba68c8', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._400, '#ab47bc', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._500, '#9c27b0', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._600, '#8e24aa', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._700, '#7b1fa2', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._800, '#6a1b9a', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType._900, '#4a148c', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType.A100, '#ea80fc', MaterialColorService.DARK_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType.A200, '#e040fb', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType.A400, '#d500f9', MaterialColorService.LIGHT_PRIMARY_TEXT));
    purple.hues.push(new Hue(HueType.A700, '#aa00ff', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(purple);

    // Deeppurple
    const deeppurple = new Palette(PaletteType.DEEP_PURPLE);
    deeppurple.hues.push(new Hue(HueType._50, '#ede7f6', MaterialColorService.DARK_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._100, '#d1c4e9', MaterialColorService.DARK_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._200, '#b39ddb', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._300, '#9575cd', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._400, '#7e57c2', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._500, '#673ab7', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._600, '#5e35b1', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._700, '#512da8', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._800, '#4527a0', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType._900, '#311b92', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType.A100, '#b388ff', MaterialColorService.DARK_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType.A200, '#7c4dff', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType.A400, '#651fff', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeppurple.hues.push(new Hue(HueType.A700, '#6200ea', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(deeppurple);

    // Indigo
    const indigo = new Palette(PaletteType.INDIGO);
    indigo.hues.push(new Hue(HueType._50, '#e8eaf6', MaterialColorService.DARK_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._100, '#c5cae9', MaterialColorService.DARK_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._200, '#9fa8da', MaterialColorService.DARK_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._300, '#7986cb', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._400, '#5c6bc0', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._500, '#3f51b5', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._600, '#3949ab', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._700, '#303f9f', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._800, '#283593', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType._900, '#1a237e', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType.A100, '#8c9eff', MaterialColorService.DARK_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType.A200, '#536dfe', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType.A400, '#3d5afe', MaterialColorService.LIGHT_PRIMARY_TEXT));
    indigo.hues.push(new Hue(HueType.A700, '#304ffe', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(indigo);

    // Blue
    const blue = new Palette(PaletteType.BLUE);
    blue.hues.push(new Hue(HueType._50, '#e3f2fd', MaterialColorService.DARK_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._100, '#bbdefb', MaterialColorService.DARK_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._200, '#90caf9', MaterialColorService.DARK_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._300, '#64b5f6', MaterialColorService.DARK_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._400, '#42a5f5', MaterialColorService.DARK_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._500, '#2196f3', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._600, '#1e88e5', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._700, '#1976d2', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._800, '#1565c0', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType._900, '#0d47a1', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType.A100, '#82b1ff', MaterialColorService.DARK_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType.A200, '#448aff', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType.A400, '#2979ff', MaterialColorService.LIGHT_PRIMARY_TEXT));
    blue.hues.push(new Hue(HueType.A700, '#2962ff', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(blue);

    // Lightblue
    const lightblue = new Palette(PaletteType.LIGHT_BLUE);
    lightblue.hues.push(new Hue(HueType._50, '#e1f5fe', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._100, '#b3e5fc', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._200, '#81d4fa', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._300, '#4fc3f7', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._400, '#29b6f6', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._500, '#03a9f4', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._600, '#039be5', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._700, '#0288d1', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._800, '#0277bd', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType._900, '#01579b', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType.A100, '#80d8ff', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType.A200, '#40c4ff', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType.A400, '#00b0ff', MaterialColorService.DARK_PRIMARY_TEXT));
    lightblue.hues.push(new Hue(HueType.A700, '#0091ea', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(lightblue);

    // Cyan
    const cyan = new Palette(PaletteType.CYAN);
    cyan.hues.push(new Hue(HueType._50, '#e0f7fa', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._100, '#b2ebf2', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._200, '#80deea', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._300, '#4dd0e1', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._400, '#26c6da', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._500, '#00bcd4', MaterialColorService.LIGHT_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._600, '#00acc1', MaterialColorService.LIGHT_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._700, '#0097a7', MaterialColorService.LIGHT_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._800, '#00838f', MaterialColorService.LIGHT_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType._900, '#006064', MaterialColorService.LIGHT_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType.A100, '#84ffff', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType.A200, '#18ffff', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType.A400, '#00e5ff', MaterialColorService.DARK_PRIMARY_TEXT));
    cyan.hues.push(new Hue(HueType.A700, '#00b8d4', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(cyan);

    // Teal
    const teal = new Palette(PaletteType.TEAL);
    teal.hues.push(new Hue(HueType._50, '#e0f2f1', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._100, '#b2dfdb', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._200, '#80cbc4', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._300, '#4db6ac', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._400, '#26a69a', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._500, '#009688', MaterialColorService.LIGHT_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._600, '#00897b', MaterialColorService.LIGHT_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._700, '#00796b', MaterialColorService.LIGHT_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._800, '#00695c', MaterialColorService.LIGHT_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType._900, '#004d40', MaterialColorService.LIGHT_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType.A100, '#a7ffeb', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType.A200, '#64ffda', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType.A400, '#1de9b6', MaterialColorService.DARK_PRIMARY_TEXT));
    teal.hues.push(new Hue(HueType.A700, '#00bfa5', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(teal);

    // Green
    const green = new Palette(PaletteType.GREEN);
    green.hues.push(new Hue(HueType._50, '#e8f5e9', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._100, '#c8e6c9', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._200, '#a5d6a7', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._300, '#81c784', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._400, '#66bb6a', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._500, '#4caf50', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._600, '#43a047', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._700, '#388e3c', MaterialColorService.LIGHT_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._800, '#2e7d32', MaterialColorService.LIGHT_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType._900, '#1b5e20', MaterialColorService.LIGHT_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType.A100, '#b9f6ca', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType.A200, '#69f0ae', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType.A400, '#00e676', MaterialColorService.DARK_PRIMARY_TEXT));
    green.hues.push(new Hue(HueType.A700, '#00c853', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(green);

    // Light Green
    const lightgreen = new Palette(PaletteType.LIGHT_GREEN);
    lightgreen.hues.push(new Hue(HueType._50, '#f1f8e9', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._100, '#dcedc8', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._200, '#c5e1a5', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._300, '#aed581', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._400, '#9ccc65', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._500, '#8bc34a', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._600, '#7cb342', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._700, '#689f38', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._800, '#558b2f', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType._900, '#33691e', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType.A100, '#ccff90', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType.A200, '#b2ff59', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType.A400, '#76ff03', MaterialColorService.DARK_PRIMARY_TEXT));
    lightgreen.hues.push(new Hue(HueType.A700, '#64dd17', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(lightgreen);

    // Lime
    const lime = new Palette(PaletteType.LIME);
    lime.hues.push(new Hue(HueType._50, '#f9fbe7', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._100, '#f0f4c3', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._200, '#e6ee9c', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._300, '#dce775', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._400, '#d4e157', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._500, '#cddc39', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._600, '#c0ca33', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._700, '#afb42b', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._800, '#9e9d24', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType._900, '#827717', MaterialColorService.LIGHT_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType.A100, '#f4ff81', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType.A200, '#eeff41', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType.A400, '#c6ff00', MaterialColorService.DARK_PRIMARY_TEXT));
    lime.hues.push(new Hue(HueType.A700, '#aeea00', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(lime);

    // Yellow
    const yellow = new Palette(PaletteType.YELLOW);
    yellow.hues.push(new Hue(HueType._50, '#fffde7', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._100, '#fff9c4', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._200, '#fff59d', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._300, '#fff176', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._400, '#ffee58', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._500, '#ffeb3b', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._600, '#fdd835', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._700, '#fbc02d', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._800, '#f9a825', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType._900, '#f57f17', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType.A100, '#ffff8d', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType.A200, '#ffff00', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType.A400, '#ffea00', MaterialColorService.DARK_PRIMARY_TEXT));
    yellow.hues.push(new Hue(HueType.A700, '#ffd600', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(yellow);


    // Amber
    const amber = new Palette(PaletteType.AMBER);
    amber.hues.push(new Hue(HueType._50, '#fff8e1', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._100, '#ffecb3', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._200, '#ffe082', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._300, '#ffd54f', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._400, '#ffca28', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._500, '#ffc107', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._600, '#ffb300', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._700, '#ffa000', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._800, '#ff8f00', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType._900, '#ff6f00', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType.A100, '#ffe57f', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType.A200, '#ffd740', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType.A400, '#ffc400', MaterialColorService.DARK_PRIMARY_TEXT));
    amber.hues.push(new Hue(HueType.A700, '#ffab00', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(amber);

    // Orange
    const orange = new Palette(PaletteType.ORANGE);
    orange.hues.push(new Hue(HueType._50, '#fff3e0', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._100, '#ffe0b2', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._200, '#ffcc80', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._300, '#ffb74d', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._400, '#ffa726', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._500, '#ff9800', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._600, '#fb8c00', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._700, '#f57c00', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._800, '#ef6c00', MaterialColorService.LIGHT_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType._900, '#e65100', MaterialColorService.LIGHT_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType.A100, '#ffd180', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType.A200, '#ffab40', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType.A400, '#ff9100', MaterialColorService.DARK_PRIMARY_TEXT));
    orange.hues.push(new Hue(HueType.A700, '#ff6d00', MaterialColorService.DARK_PRIMARY_TEXT));
    this.palettes.push(orange);

    // Deep Orange
    const deeporange = new Palette(PaletteType.DEEP_ORANGE);
    deeporange.hues.push(new Hue(HueType._50, '#fbe9e7', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._100, '#ffccbc', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._200, '#ffab91', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._300, '#ff8a65', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._400, '#ff7043', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._500, '#ff5722', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._600, '#f4511e', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._700, '#e64a19', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._800, '#d84315', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType._900, '#bf360c', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType.A100, '#ff9e80', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType.A200, '#ff6e40', MaterialColorService.DARK_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType.A400, '#ff3d00', MaterialColorService.LIGHT_PRIMARY_TEXT));
    deeporange.hues.push(new Hue(HueType.A700, '#dd2c00', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(deeporange);

    // Brown
    const brown = new Palette(PaletteType.BROWN);
    brown.hues.push(new Hue(HueType._50, '#efebe9', MaterialColorService.DARK_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._100, '#d7ccc8', MaterialColorService.DARK_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._200, '#bcaaa4', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._300, '#a1887f', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._400, '#8d6e63', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._500, '#795548', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._600, '#6d4c41', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._700, '#5d4037', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._800, '#4e342e', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType._900, '#3e2723', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType.A100, '#d7ccc8', MaterialColorService.DARK_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType.A200, '#bcaaa4', MaterialColorService.DARK_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType.A400, '#8d6e63', MaterialColorService.LIGHT_PRIMARY_TEXT));
    brown.hues.push(new Hue(HueType.A700, '#5d4037', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(brown);

    // Grey
    const grey = new Palette(PaletteType.GREY);
    grey.hues.push(new Hue(HueType._50, '#fafafa', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._100, '#f5f5f5', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._200, '#eeeeee', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._300, '#e0e0e0', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._400, '#bdbdbd', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._500, '#9e9e9e', MaterialColorService.LIGHT_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._600, '#757575', MaterialColorService.LIGHT_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._700, '#616161', MaterialColorService.LIGHT_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._800, '#424242', MaterialColorService.LIGHT_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType._900, '#212121', MaterialColorService.LIGHT_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType.A100, MaterialColorService.LIGHT_PRIMARY_TEXT, MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType.A200, '#eeeeee', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType.A400, '#bdbdbd', MaterialColorService.DARK_PRIMARY_TEXT));
    grey.hues.push(new Hue(HueType.A700, '#616161', MaterialColorService.LIGHT_PRIMARY_TEXT));
    this.palettes.push(grey);
  }

  /**
   * Returns the personColor of a given palette and a hue
   * @param paletteType personColor palette
   * @param hueType personColor hue
   */
  public color(paletteType: PaletteType, hueType: HueType): string {
    const hue = this.hue(paletteType, hueType);

    if (hue == null) {
      return 'transparent';
    }

    return hue.color;
  }

  /**
   * Returns the contrast of a given palette and a hue
   * @param paletteType personColor palette
   * @param hueType personColor hue
   */
  public contrast(paletteType: PaletteType, hueType: HueType): string {
    const hue = this.hue(paletteType, hueType);

    if (hue == null) {
      return 'transparent';
    }

    return hue.contrast;
  }

  /**
   * Returns the hue of a given palette and a hue typep
   * @param paletteType personColor palette
   * @param hueType hue type
   */
  public hue(paletteType: PaletteType, hueType: HueType): Hue {
    const pal = this.palettes.find(p => {
      return p.type === paletteType;
    });

    if (pal == null) {
      return null;
    }

    return pal.hues.find(h => {
      return h.type === hueType;
    });
  }
}
