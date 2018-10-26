import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './pages/settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule
  ],
  declarations: [SettingsComponent],
  entryComponents: [
    // Pages
    SettingsComponent
  ]
})
export class SettingsModule {
}
