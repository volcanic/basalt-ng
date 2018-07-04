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
  MatChipsModule,
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
import {ConfirmationDialogComponent} from './view/dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {TaskletDialogComponent} from './view/dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {TaskletComponent} from './view/components/tasklet/tasklet/tasklet.component';
import {SnackbarService} from './services/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TaskletDialogContentComponent} from './view/dialogs/tasklet/tasklet-dialog-content/tasklet-dialog-content.component';
import {DateService} from './services/date.service';
import {TagDialogComponent} from './view/dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {MatchService} from './services/match.service';
import {TimelineToolbarComponent} from './view/toolbars/timeline-toolbar/timeline-toolbar.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {TimePickerDialogComponent} from './view/dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {PersonDialogComponent} from './view/dialogs/other/person-dialog/person-dialog.component';
import {AboutDialogComponent} from './view/dialogs/app-info/about-dialog/about-dialog.component';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {SettingsService} from './services/settings.service';
import {TaskletDialogDailyScrumComponent} from './view/dialogs/tasklet/tasklet-dialog-daily-scrum/tasklet-dialog-daily-scrum.component';
import {TaskletDailyScrumComponent} from './view/components/tasklet/tasklet-daily-scrum/tasklet-daily-scrum.component';
import {ProjectsFilterDialogComponent} from './view/dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {TaskletDialogDailyScrumActivityComponent} from './view/dialogs/tasklet/tasklet-dialog-daily-scrum-activity/tasklet-dialog-daily-scrum-activity.component';
import {TaskletDialogDailyScrumParticipantComponent} from './view/dialogs/tasklet/tasklet-dialog-daily-scrum-participant/tasklet-dialog-daily-scrum-participant.component';
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
import {CalendarComponent} from './view/pages/calendar/calendar.component';
import {CalendarGridComponent} from './view/components/calendar/calendar-grid/calendar-grid.component';
import {CalendarGridDayComponent} from './view/components/calendar/calendar-grid-day/calendar-grid-day.component';
import {CalendarGridQuarterHourComponent} from './view/components/calendar/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component';
import {CalendarItemComponent} from './view/components/calendar/calendar-item/calendar-item.component';
import {TaskDialogComponent} from './view/dialogs/other/task-dialog/task-dialog.component';
import {TaskletService} from './services/entities/tasklet.service';
import {TaskListItemComponent} from './view/components/lists/task-list-item/task-list-item.component';
import {TaskListComponent} from './view/components/lists/task-list/task-list.component';
import {TimelineComponent} from './view/pages/timeline/timeline.component';
import {DescriptionFragmentComponent} from './view/fragments/description-fragment/description-fragment.component';
import {TagSelectionFragmentComponent} from './view/fragments/tag-selection-fragment/tag-selection-fragment.component';
import {TagChipsFragmentComponent} from './view/fragments/tag-chips-fragment/tag-chips-fragment.component';
import {PersonChipsFragmentComponent} from './view/fragments/person-chips-fragment/person-chips-fragment.component';
import {TaskAutocompleteFragmentComponent} from './view/fragments/task-autocomplete-fragment/task-autocomplete-fragment.component';
import {ProjectAutocompleteFragmentComponent} from './view/fragments/project-autocomplete-fragment/project-autocomplete-fragment.component';

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
    TaskletDailyScrumComponent,
    TaskletDialogComponent,
    TaskletDialogDailyScrumComponent,
    TaskletDialogDailyScrumActivityComponent,
    TaskletDialogDailyScrumParticipantComponent,
    TaskletDialogContentComponent,
    TaskletDialogHeaderComponent,
    TaskletDialogWeeklyDigestComponent,
    TimelineComponent,
    TimelineToolbarComponent,
    TaskletWeeklyDigestComponent,
    TimePickerDialogComponent,
    UploadDialogComponent,
    ProjectEffortTreeComponent,
    DailyEffortTreeComponent,
    TaskletDailyDigestComponent,
    ProjectDialogComponent,
    CalendarComponent,
    CalendarGridComponent,
    CalendarGridDayComponent,
    CalendarGridQuarterHourComponent,
    CalendarItemComponent,
    TaskDialogComponent,
    TaskListComponent,
    TaskListItemComponent,
    TagSelectionFragmentComponent,
    DescriptionFragmentComponent,
    TagChipsFragmentComponent,
    PersonChipsFragmentComponent,
    TaskAutocompleteFragmentComponent,
    ProjectAutocompleteFragmentComponent
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
    MatChipsModule,
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
    TaskletDialogWeeklyDigestComponent,
    TimePickerDialogComponent,
    UploadDialogComponent,
    TaskDialogComponent
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
    TaskletService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
