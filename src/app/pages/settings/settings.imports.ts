import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {SettingsRoutingModule} from './settings-routing.module';
import {MaterialModule} from '../../ui/material/material.module';

/** Imports for settings module */
export const SettingsImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ScrollDispatchModule,
  MaterialModule,
  SettingsRoutingModule
];
