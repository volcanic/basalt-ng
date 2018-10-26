import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './pages/settings/settings.component';
import {SettingsToolbarComponent} from './components/toolbars/settings-toolbar/settings-toolbar.component';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {MaterialModule} from '../../ui/material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollDispatchModule,
    MaterialModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent,
    SettingsToolbarComponent
  ],
  entryComponents: [
    // Pages
    SettingsComponent
  ]
})
export class SettingsModule {
}
