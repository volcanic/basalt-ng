import {CommonModule} from '@angular/common';
import {StartRoutingModule} from './start-routing.module';
import {MaterialModule} from '../../ui/material/material.module';

/** Imports for start module */
export const StartImports = [
  CommonModule,
  StartRoutingModule,

  // Material Design
  MaterialModule,
];
