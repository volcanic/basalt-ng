import {Injectable} from '@angular/core';

export enum Hue {
  _50,
  _100,
  _200,
  _300,
  _400,
  _500,
  _600,
  _700,
  _800,
  _900,
  A100,
  A200,
  A400,
  A700
}

export enum Palette {
  RED,
  PINK,
  PURPLE,
  DEEP_PURPLE,
  INDIGO,
  BLUE,
  LIGHT_BLUE,
  CYAN,
  TEAL,
  GREEN,
  LIGHT_GREEN,
  LIME,
  YELLOW,
  AMBER,
  ORANGE,
  DEEP_ORANGE,
  BROWN,
  GREY
}

@Injectable({
  providedIn: 'root'
})
export class MaterialColorService {

  static colors: Map<Palette, Map<Hue, string>> = new Map<Palette, Map<Hue, string>>();

  constructor() {
    // Red
    const red = new Map<Hue, string>();

    // Green
    const green = new Map<Hue, string>();
    green.set(Hue._50, '#e8f5e9');
    green.set(Hue._100, '#c8e6c9');
    green.set(Hue._200, ' #a5d6a7');
    green.set(Hue._300, ' #81c784');
    green.set(Hue._400, ' #66bb6a');
    green.set(Hue._500, ' #4caf50');
    green.set(Hue._600, ' #43a047');
    green.set(Hue._700, ' #388e3c');
    green.set(Hue._800, ' #2e7d32');
    green.set(Hue._900, ' #1b5e20');
    green.set(Hue.A100, ' #b9f6ca');
    green.set(Hue.A200, ' #69f0ae');
    green.set(Hue.A400, ' #00e676');
    green.set(Hue.A700, ' #00c853');
    MaterialColorService.colors.set(Palette.GREEN, green);

    // Light Green
    const lightGreen = new Map<Hue, string>();
    lightGreen.set(Hue._50, '#f1f8e9');
    lightGreen.set(Hue._100, '#dcedc8');
    lightGreen.set(Hue._200, ' #c5e1a5');
    lightGreen.set(Hue._300, ' #aed581');
    lightGreen.set(Hue._400, ' #9ccc65');
    lightGreen.set(Hue._500, ' #8bc34a');
    lightGreen.set(Hue._600, ' #7cb342');
    lightGreen.set(Hue._700, ' #689f38');
    lightGreen.set(Hue._800, ' #558b2f');
    lightGreen.set(Hue._900, ' #33691e');
    lightGreen.set(Hue.A100, ' #ccff90');
    lightGreen.set(Hue.A200, ' #b2ff59');
    lightGreen.set(Hue.A400, ' #76ff03');
    lightGreen.set(Hue.A700, ' #64dd17');
    MaterialColorService.colors.set(Palette.LIGHT_GREEN, lightGreen);

    // Lime
    const lime = new Map<Hue, string>();
    lime.set(Hue._50, '#f9fbe7');
    lime.set(Hue._100, '#f0f4c3');
    lime.set(Hue._200, ' #e6ee9c');
    lime.set(Hue._300, ' #dce775');
    lime.set(Hue._400, ' #d4e157');
    lime.set(Hue._500, ' #cddc39');
    lime.set(Hue._600, ' #c0ca33');
    lime.set(Hue._700, ' #afb42b');
    lime.set(Hue._800, ' #9e9d24');
    lime.set(Hue._900, ' #827717');
    lime.set(Hue.A100, ' #f4ff81');
    lime.set(Hue.A200, ' #eeff41');
    lime.set(Hue.A400, ' #c6ff00');
    lime.set(Hue.A700, ' #aeea00');
    MaterialColorService.colors.set(Palette.LIME, lime);
  }

  public static color(palette: Palette, hue: Hue): string {
    const pal = MaterialColorService.colors.get(palette);

    if (palette != null) {
      return 'transparent';
    }

    const color = pal.get(hue);

    if (palette != null) {
      return 'transparent';
    }

    return color;
  }

  public static contrast(palette: Palette, hue: Hue): string {
    return null;
  }
}
