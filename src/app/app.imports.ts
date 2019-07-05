import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MatDialogModule, MatSnackBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {NewFeaturesDialogModule} from './ui/new-features-dialog/new-features-dialog.module';

/** Imports for app module */
export const AppImports = [
  AppRoutingModule,
  BrowserAnimationsModule,
  FormsModule,

  MatSnackBarModule,
  MatDialogModule,

  HttpModule,
  HttpClientModule,
  NewFeaturesDialogModule,

  // Progressive Web App
  ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
];
