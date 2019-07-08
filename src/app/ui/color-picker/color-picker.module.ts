import {NgModule} from '@angular/core';
import {ColorPickerImports} from './color-picker.imports';
import {ColorPickerDeclarations} from './color-picker.declarations';
import {ColorPickerComponent} from './color-picker/color-picker.component';

@NgModule({
  declarations: [ColorPickerDeclarations],
  exports: [
    ColorPickerComponent
  ],
  imports: [ColorPickerImports]
})
export class ColorPickerModule { }
