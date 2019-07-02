import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MatDialogModule, MatSnackBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './ui/material/material.module';
import {CoreModule} from './core/core.module';
import {NewFeaturesDialogModule} from './ui/new-features-dialog/new-features-dialog.module';

/** Imports for app module */
export const AppImports = [
  AppRoutingModule,
  BrowserModule,
  FormsModule,

  MatSnackBarModule,
  MatDialogModule,

  HttpModule,
  HttpClientModule,
  NewFeaturesDialogModule,

  // Progressive Web App
  ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
];
