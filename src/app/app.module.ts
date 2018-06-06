import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
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
  MatTooltipModule,
  MatTreeModule
} from '@angular/material';
import {PouchDBService} from './services/pouchdb.service';
import {TaskletsService} from './services/tasklets.service';
import {ConfirmationDialogComponent} from './view/dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {TaskletDialogComponent} from './view/dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {TaskletsComponent} from './view/pages/tasklets/tasklets.component';
import {TaskletComponent} from './view/components/tasklet/tasklet/tasklet.component';
import {SnackbarService} from './services/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TaskletTodoComponent} from './view/components/tasklet/tasklet-todo/tasklet-todo.component';
import {TaskletDialogTodoComponent} from './view/dialogs/tasklet/tasklet-dialog-todo/tasklet-dialog-todo.component';
import {TaskletDialogContentComponent} from './view/dialogs/tasklet/tasklet-dialog-content/tasklet-dialog-content.component';
import {TaskletDefaultComponent} from './view/components/tasklet/tasklet-default/tasklet-default.component';
import {DateService} from './services/date.service';
import {TagDialogComponent} from './view/dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {MatchService} from './services/match.service';
import {TodosComponent} from './view/pages/todos/todos.component';
import {TodosToolbarComponent} from './view/toolbars/todos-toolbar/todos-toolbar.component';
import {TaskletsToolbarComponent} from './view/toolbars/tasklet-toolbar/tasklets-toolbar.component';
import {TodoComponent} from './view/components/todo/todo/todo.component';
import {TodosSideMenuStartComponent} from './view/sidemenus/todos-side-menu-start/todos-side-menu-start.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {TimePickerDialogComponent} from './view/dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {PersonDialogComponent} from './view/dialogs/other/person-dialog/person-dialog.component';
import {TaskletDialogParticipantsComponent} from './view/dialogs/tasklet/tasklet-dialog-participants/tasklet-dialog-participants.component';
import {TaskletParticipantsComponent} from './view/components/tasklet/tasklet-participants/tasklet-participants.component';
import {AboutDialogComponent} from './view/dialogs/app-info/about-dialog/about-dialog.component';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {SettingsService} from './services/settings.service';
import {TaskletDialogDailyScrumComponent} from './view/dialogs/tasklet/tasklet-dialog-daily-scrum/tasklet-dialog-daily-scrum.component';
import {TaskletDailyScrumComponent} from './view/components/tasklet/tasklet-daily-scrum/tasklet-daily-scrum.component';
import {ProjectsFilterDialogComponent} from './view/dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {TaskletDialogDailyScrumActivityComponent} from './view/dialogs/tasklet/tasklet-dialog-daily-scrum-activity/tasklet-dialog-daily-scrum-activity.component';
import {TaskletDialogDailyScrumParticipantComponent} from './view/dialogs/tasklet/tasklet-dialog-daily-scrum-participant/tasklet-dialog-daily-scrum-participant.component';
import {TaskletDialogTagsComponent} from './view/dialogs/tasklet/tasklet-dialog-tags/tasklet-dialog-tags.component';
import {TaskletDialogTopicComponent} from './view/dialogs/tasklet/tasklet-dialog-topic/tasklet-dialog-topic.component';
import {TaskletDialogHeaderComponent} from './view/dialogs/tasklet/tasklet-dialog-header/tasklet-dialog-header.component';
import {UploadDialogComponent} from './view/dialogs/other/upload-dialog/upload-dialog.component';
import {FileDropComponent} from './view/components/file-drop/file-drop.component';
import {FileUploadModule} from 'ng2-file-upload';
import {TaskletWeeklyDigestComponent} from './view/components/tasklet/tasklet-weekly-digest/tasklet-weekly-digest.component';
import {TaskletDialogWeeklyDigestComponent} from './view/dialogs/tasklet/tasklet-dialog-weekly-digest/tasklet-dialog-weekly-digest.component';
import {DigestService} from './services/digest.service';
import {ColorService} from './services/color.service';
import {HttpClientModule} from '@angular/common/http';
import {ProjectEffortTreeComponent} from './view/components/trees/weekly-effort-tree/weekly-effort-tree.component';
import {DailyEffortTreeComponent} from './view/components/trees/daily-effort-tree/daily-effort-tree.component';
import {TaskletDailyDigestComponent} from './view/components/tasklet/tasklet-daily-digest/tasklet-daily-digest.component';
import {ProjectDialogComponent} from './view/dialogs/other/project-dialog/project-dialog.component';

@NgModule({
  declarations: [
    AboutDialogComponent,
    AppComponent,
    ConfirmationDialogComponent,
    DailyEffortTreeComponent,
    FileDropComponent,
    NewFeaturesDialogComponent,
    PersonDialogComponent,
    ProjectsFilterDialogComponent,
    SplashScreenComponent,
    TagDialogComponent,
    TaskletComponent,
    TaskletDefaultComponent,
    TaskletDailyScrumComponent,
    TaskletDialogComponent,
    TaskletDialogTagsComponent,
    TaskletDialogDailyScrumComponent,
    TaskletDialogDailyScrumActivityComponent,
    TaskletDialogDailyScrumParticipantComponent,
    TaskletDialogContentComponent,
    TaskletDialogHeaderComponent,
    TaskletDialogParticipantsComponent,
    TaskletDialogTopicComponent,
    TaskletDialogTodoComponent,
    TaskletDialogWeeklyDigestComponent,
    TaskletParticipantsComponent,
    TaskletsComponent,
    TaskletsToolbarComponent,
    TaskletTodoComponent,
    TaskletWeeklyDigestComponent,
    TimePickerDialogComponent,
    TodoComponent,
    TodosComponent,
    TodosSideMenuStartComponent,
    TodosToolbarComponent,
    UploadDialogComponent,
    ProjectEffortTreeComponent,
    DailyEffortTreeComponent,
    TaskletDailyDigestComponent,
    ProjectDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
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
    MatTreeModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AboutDialogComponent,
    ConfirmationDialogComponent,
    NewFeaturesDialogComponent,
    PersonDialogComponent,
    ProjectDialogComponent,
    ProjectsFilterDialogComponent,
    TagDialogComponent,
    TaskletDialogComponent,
    TaskletDialogDailyScrumComponent,
    TaskletDialogContentComponent,
    TaskletDialogParticipantsComponent,
    TaskletDialogTagsComponent,
    TaskletDialogTodoComponent,
    TaskletDialogWeeklyDigestComponent,
    TimePickerDialogComponent,
    UploadDialogComponent
  ],
  providers: [
    MatIconRegistry,
    ColorService,
    DateService,
    DigestService,
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
