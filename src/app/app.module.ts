import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {ResponsiveModule} from 'ng2-responsive';
import {ToolbarComponent} from './view/toolbars/toolbar/toolbar.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
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
import {TaskletTodoComponent} from './view/components/tasklet-todo/tasklet-todo.component';
import {TaskletDialogTodoComponent} from './view/dialogs/tasklet-dialog-todo/tasklet-dialog-todo.component';
import {TaskletDialogDefaultComponent} from './view/dialogs/tasklet-dialog-default/tasklet-dialog-default.component';
import {TaskletDefaultComponent} from './view/components/tasklet-default/tasklet-default.component';
import {DateService} from './services/date.service';
import {TagDialogComponent} from './view/dialogs/tag-dialog/tag-dialog.component';
import {MatchService} from './services/match.service';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    SideMenuComponent,
    TagDialogComponent,
    TaskletComponent,
    TaskletDialogComponent,
    TaskletsComponent,
    ToolbarComponent,
    TaskletTodoComponent,
    TaskletDialogTodoComponent,
    TaskletDialogDefaultComponent,
    TaskletDefaultComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    ResponsiveModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    TagDialogComponent,
    TaskletDialogComponent
  ],
  providers: [
    MatIconRegistry,
    DateService,
    MatchService,
    PouchDBService,
    SnackbarService,
    TaskletsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
