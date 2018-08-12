import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {
  MatAutocompleteModule,
  MatBadgeModule,
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
import {PouchDBService} from './services/persistence/pouchdb.service';
import {ConfirmationDialogComponent} from './view/dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {TaskletDialogComponent} from './view/dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {SnackbarService} from './services/ui/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DateService} from './services/util/date.service';
import {TagFilterDialogComponent} from './view/dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {MatchService} from './services/entities/filter/match.service';
import {TimelineToolbarComponent} from './view/toolbars/timeline-toolbar/timeline-toolbar.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {TimePickerDialogComponent} from './view/dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {AboutDialogComponent} from './view/dialogs/app-info/about-dialog/about-dialog.component';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {PouchDBSettingsService} from './services/persistence/pouchdb-settings.service';
import {SettingsService} from './services/persistence/settings.service';
import {ProjectsFilterDialogComponent} from './view/dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {DailyScrumActivityFragmentComponent} from './view/fragments/daily-scrum-activity-fragment/daily-scrum-activity-fragment.component';
import {DailyScrumParticipantFragmentComponent} from './view/fragments/daily-scrum-participant-fragment/daily-scrum-participant-fragment.component';
import {UploadDialogComponent} from './view/dialogs/other/upload-dialog/upload-dialog.component';
import {FileDropComponent} from './view/components/file-drop/file-drop.component';
import {FileUploadModule} from 'ng2-file-upload';
import {TaskletWeeklyDigestComponent} from './view/components/tasklet/tasklet-weekly-digest/tasklet-weekly-digest.component';
import {WeeklyDigestFragmentComponent} from './view/fragments/weekly-digest-fragment/weekly-digest-fragment.component';
import {DigestService} from './services/entities/digest/digest.service';
import {ColorService} from './services/ui/color.service';
import {HttpClientModule} from '@angular/common/http';
import {ProjectEffortTreeComponent} from './view/components/trees/weekly-effort-tree/weekly-effort-tree.component';
import {DailyEffortTreeComponent} from './view/components/trees/daily-effort-tree/daily-effort-tree.component';
import {TaskletDailyDigestComponent} from './view/components/tasklet/tasklet-daily-digest/tasklet-daily-digest.component';
import {CalendarComponent} from './view/pages/calendar/calendar.component';
import {CalendarGridComponent} from './view/components/calendar/calendar-grid/calendar-grid.component';
import {CalendarGridDayComponent} from './view/components/calendar/calendar-grid-day/calendar-grid-day.component';
import {CalendarGridQuarterHourComponent} from './view/components/calendar/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component';
import {CalendarItemComponent} from './view/components/calendar/calendar-item/calendar-item.component';
import {TaskDialogComponent} from './view/dialogs/entities/task-dialog/task-dialog.component';
import {TaskletService} from './services/entities/tasklet.service';
import {TaskListItemComponent} from './view/lists/task-list-item/task-list-item.component';
import {TaskListComponent} from './view/lists/task-list/task-list.component';
import {TimelineComponent} from './view/pages/timeline/timeline.component';
import {DescriptionFragmentComponent} from './view/fragments/description-fragment/description-fragment.component';
import {TagSelectionFragmentComponent} from './view/fragments/tag-selection-fragment/tag-selection-fragment.component';
import {TagChipsFragmentComponent} from './view/fragments/tag-chips-fragment/tag-chips-fragment.component';
import {PersonChipsFragmentComponent} from './view/fragments/person-chips-fragment/person-chips-fragment.component';
import {TaskAutocompleteFragmentComponent} from './view/fragments/task-autocomplete-fragment/task-autocomplete-fragment.component';
import {ProjectAutocompleteFragmentComponent} from './view/fragments/project-autocomplete-fragment/project-autocomplete-fragment.component';
import {PreviousDescriptionFragmentComponent} from './view/fragments/previous-description-fragment/previous-description-fragment.component';
import {PersonAutocompleteFragmentComponent} from './view/fragments/person-autocomplete-fragment/person-autocomplete-fragment.component';
import {HeaderFragmentComponent} from './view/fragments/header-fragment/header-fragment.component';
import {TaskletDailyScrumComponent} from './view/components/tasklet/tasklet-daily-scrum/tasklet-daily-scrum.component';
import {DailyScrumFragmentComponent} from './view/fragments/daily-scrum-fragment/daily-scrum-fragment.component';
import {DateTimePickerFragmentComponent} from './view/fragments/date-time-picker-fragment/date-time-picker-fragment.component';
import {ProjectListComponent} from './view/lists/project-list/project-list.component';
import {ProjectListItemComponent} from './view/lists/project-list-item/project-list-item.component';
import {ProjectDialogComponent} from './view/dialogs/entities/project-dialog/project-dialog.component';
import {InformationDialogComponent} from './view/dialogs/other/information-dialog/information-dialog.component';
import {TaskletListComponent} from './view/lists/tasklet-list/tasklet-list.component';
import {TaskletListItemComponent} from './view/lists/tasklet-list-item/tasklet-list-item.component';
import {FilterTagListComponent} from './view/lists/filter-tag-list/filter-tag-list.component';
import {FilterTagListItemComponent} from './view/lists/filter-tag-list-item/filter-tag-list-item.component';
import {FilterProjectListComponent} from './view/lists/filter-project-list/filter-project-list.component';
import {FilterProjectListItemComponent} from './view/lists/filter-project-list-item/filter-project-list-item.component';
import {MediaService} from './services/ui/media.service';
import {ProjectListDialogComponent} from './view/dialogs/lists/project-list-dialog/project-list-dialog.component';
import {TaskListDialogComponent} from './view/dialogs/lists/task-list-dialog/task-list-dialog.component';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {InViewportModule} from 'ng-in-viewport';

@NgModule({
  declarations: [
    AboutDialogComponent,
    AppComponent,
    ConfirmationDialogComponent,
    DailyEffortTreeComponent,
    FileDropComponent,
    NewFeaturesDialogComponent,
    ProjectsFilterDialogComponent,
    SplashScreenComponent,
    TagFilterDialogComponent,
    TaskletDialogComponent,
    TimelineComponent,
    TimelineToolbarComponent,
    TaskletWeeklyDigestComponent,
    TimePickerDialogComponent,
    UploadDialogComponent,
    ProjectEffortTreeComponent,
    DailyEffortTreeComponent,
    TaskletDailyDigestComponent,
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
    ProjectAutocompleteFragmentComponent,
    PersonAutocompleteFragmentComponent,
    PreviousDescriptionFragmentComponent,
    WeeklyDigestFragmentComponent,
    DailyScrumFragmentComponent,
    DailyScrumActivityFragmentComponent,
    DailyScrumParticipantFragmentComponent,
    HeaderFragmentComponent,
    TaskletDailyScrumComponent,
    DateTimePickerFragmentComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    ProjectDialogComponent,
    InformationDialogComponent,
    TaskletListComponent,
    TaskletListItemComponent,
    FilterTagListComponent,
    FilterTagListItemComponent,
    FilterProjectListComponent,
    FilterProjectListItemComponent,
    ProjectListDialogComponent,
    TaskListDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    InViewportModule,
    MatAutocompleteModule,
    MatBadgeModule,
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
    ReactiveFormsModule,
    ScrollDispatchModule
  ],
  entryComponents: [
    AboutDialogComponent,
    ConfirmationDialogComponent,
    NewFeaturesDialogComponent,
    ProjectsFilterDialogComponent,
    TagFilterDialogComponent,
    TaskletDialogComponent,
    TimePickerDialogComponent,
    UploadDialogComponent,
    TaskDialogComponent,
    ProjectDialogComponent,
    InformationDialogComponent,
    ProjectListDialogComponent,
    TaskListDialogComponent
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
    TaskletService,
    MediaService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
