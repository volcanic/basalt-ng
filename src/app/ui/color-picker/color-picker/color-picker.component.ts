import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays a color picker
 */
@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {

  /** Color options */
  @Input() colorOptions: string[];
  /** Contrast options */
  @Input() contrastOptions: string[];
  /** Disabled colors */
  @Input() colorsDisabled: string[];
  /** Currently selected color */
  @Input() selected: string;
  /** Event emitter indicating color selection */
  @Output() colorSelectedEmitter = new EventEmitter<{ color: string, contrast: string }>();

  /**
   * Checks if a color is disabled
   * @param color color
   */
  isDisabled(color: string) {
    return this.colorsDisabled.some(disabledColor => {
      return disabledColor === color;
    });
  }

  //
  // Actions
  //

  /**
   * Handles color selection
   * @param index index
   */
  onColorSelected(index: number) {
    this.colorSelectedEmitter.emit({color: this.colorOptions[index], contrast: this.contrastOptions[index]});
  }
}
