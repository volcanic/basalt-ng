import {EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StopWatchComponent} from './stop-watch/stop-watch.component';
import {DateService} from '../../core/entity/services/date.service';
import {PaletteType} from '../../core/ui/model/palette-type.enum';
import {HueType} from '../../core/ui/model/hue-type.enum';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StopWatchComponent],
  entryComponents: [StopWatchComponent],
  exports: [StopWatchComponent]
})
export class StopWatchModule {
}
