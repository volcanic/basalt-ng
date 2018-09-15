import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsService} from './services/settings.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    SettingsService
  ]
})
export class SettingsModule {
}
