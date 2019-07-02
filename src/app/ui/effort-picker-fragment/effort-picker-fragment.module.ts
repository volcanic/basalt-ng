import {NgModule} from '@angular/core';
import {EffortPickerFragmentComponent} from './effort-picker-fragment/effort-picker-fragment.component';
import {EffortPickerFragmentImports} from './effort-picker-fragment.imports';
import {EffortPickerDeclarations} from './effort-picker-fragment.declaration';

@NgModule({
  imports: [EffortPickerFragmentImports],
  declarations: [EffortPickerDeclarations],
  exports: [EffortPickerFragmentComponent]
})
export class EffortPickerFragmentModule {
}
