import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IntroRoutingModule} from './intro-routing.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import {MaterialModule} from '../../ui/material/material.module';

/** Imports for intro module */
export const IntroImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,

  IntroRoutingModule,

  NewFeaturesDialogModule,
  SuggestedActionButtonModule
];
