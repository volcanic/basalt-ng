import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {ResponsiveModule} from 'ng2-responsive';
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
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {PouchDBService} from './services/pouchdb.service';
import {TaskletsService} from './services/tasklets.service';
import {ConfirmationDialogComponent} from './view/dialogs/confirmation-dialog/confirmation-dialog.component';
import {TaskletDialogComponent} from './view/dialogs/tasklet-dialog/tasklet-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {TaskletsComponent} from './view/pages/tasklets/tasklets.component';
import {TaskletComponent} from './view/components/tasklet/tasklet.component';
import {SnackbarService} from './services/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TaskletTodoComponent} from './view/components/tasklet-todo/tasklet-todo.component';
import {TaskletDialogTodoComponent} from './view/dialogs/tasklet-dialog-todo/tasklet-dialog-todo.component';
import {TaskletDialogDefaultComponent} from './view/dialogs/tasklet-dialog-default/tasklet-dialog-default.component';
import {TaskletDefaultComponent} from './view/components/tasklet-default/tasklet-default.component';
import {DateService} from './services/date.service';
import {TagDialogComponent} from './view/dialogs/tag-dialog/tag-dialog.component';
import {MatchService} from './services/match.service';
import {TodosComponent} from './view/pages/todos/todos.component';
import {TodosToolbarComponent} from './view/toolbars/todos-toolbar/todos-toolbar.component';
import {TaskletsToolbarComponent} from './view/toolbars/tasklet-toolbar/tasklets-toolbar.component';
import {TodoComponent} from './view/components/todo/todo.component';
import {TodosSideMenuStartComponent} from './view/sidemenus/todos-side-menu-start/todos-side-menu-start.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {TimePickerDialogComponent} from './view/dialogs/time-picker-dialog/time-picker-dialog.component';
import {PersonDialogComponent} from './view/dialogs/person-dialog/person-dialog.component';
import {TaskletDialogParticipantsComponent} from './view/dialogs/tasklet-dialog-participants/tasklet-dialog-participants.component';
import {TaskletParticipantsComponent} from './view/components/tasklet-participants/tasklet-participants.component';
import {AboutDialogComponent} from './view/dialogs/about-dialog/about-dialog.component';
import {NewFeaturesDialogComponent} from './view/dialogs/new-features-dialog/new-features-dialog.component';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {SettingsService} from './services/settings.service';
import {TaskletDialogDailyScrumComponent} from './view/dialogs/tasklet-dialog-daily-scrum/tasklet-dialog-daily-scrum.component';
import {TaskletDialogDailyScrumActivityComponent} from './view/dialogs/tasklet-dialog-daily-scrum-activity/tasklet-dialog-daily-scrum-activity.component';
import {TaskletDialogDailyScrumParticipantComponent} from './view/dialogs/tasklet-dialog-daily-scrum-participant/tasklet-dialog-daily-scrum-participant.component';
import {TaskletDailyScrumComponent} from './view/components/tasklet-daily-scrum/tasklet-daily-scrum.component';
import {ProjectDialogComponent} from './view/dialogs/project-dialog/project-dialog.component';

@NgModule({
  declarations: [
    AboutDialogComponent,
    AppComponent,
    ConfirmationDialogComponent,
    NewFeaturesDialogComponent,
    PersonDialogComponent,
    ProjectDialogComponent,
    SplashScreenComponent,
    TagDialogComponent,
    TaskletComponent,
    TaskletDefaultComponent,
    TaskletDialogComponent,
    TaskletDialogDailyScrumComponent,
    TaskletDialogDailyScrumActivityComponent,
    TaskletDialogDailyScrumParticipantComponent,
    TaskletDialogDefaultComponent,
    TaskletDialogParticipantsComponent,
    TaskletDialogTodoComponent,
    TaskletParticipantsComponent,
    TaskletsComponent,
    TaskletsToolbarComponent,
    TaskletTodoComponent,
    TodoComponent,
    TodosComponent,
    TodosSideMenuStartComponent,
    TodosToolbarComponent,
    TimePickerDialogComponent,
    TaskletDailyScrumComponent,
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
    MatTooltipModule,
    ReactiveFormsModule,
    ResponsiveModule
  ],
  entryComponents: [
    AboutDialogComponent,
    ConfirmationDialogComponent,
    NewFeaturesDialogComponent,
    PersonDialogComponent,
    ProjectDialogComponent,
    TagDialogComponent,
    TaskletDialogComponent,
    TaskletDialogDailyScrumComponent,
    TaskletDialogDefaultComponent,
    TaskletDialogParticipantsComponent,
    TaskletDialogTodoComponent,
    TimePickerDialogComponent
  ],
  providers: [
    MatIconRegistry,
    DateService,
    MatchService,
    PouchDBService,
    PouchDBSettingsService,
    SettingsService,
    SnackbarService,
    TaskletsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
