import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PersonIndicatorButtonComponent} from './person-indicator-button/person-indicator-button.component';
import {MatButtonModule, MatTooltipModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule
  ],
  declarations: [PersonIndicatorButtonComponent],
  exports: [PersonIndicatorButtonComponent]
})
export class PersonIndicatorButtonModule {
}
