import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {ResponsiveModule} from 'ng2-responsive';
import {ToolbarComponent} from './view/toolbars/toolbar/toolbar.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {PouchDBService} from './services/pouchdb.service';
import {TaskletsService} from './services/tasklets.service';
import {ConfirmationDialogComponent} from './view/dialogs/confirmation-dialog/confirmation-dialog.component';
import {TaskletDialogComponent} from './view/dialogs/tasklet-dialog/tasklet-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {TaskletsComponent} from './view/pages/tasklets/tasklets.component';
import {TaskletComponent} from './view/components/tasklet/tasklet.component';
import {SideMenuComponent} from './view/components/side-menu/side-menu.component';
import {SnackbarService} from './services/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    SideMenuComponent,
    TaskletComponent,
    TaskletDialogComponent,
    TaskletsComponent,
    ToolbarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    ResponsiveModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    TaskletDialogComponent
  ],
  providers: [
    MatIconRegistry,
    PouchDBService,
    SnackbarService,
    TaskletsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
