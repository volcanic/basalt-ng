import {AboutDialogComponent} from './view/dialogs/app-info/about-dialog/about-dialog.component';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CalendarComponent} from './view/pages/calendar/calendar.component';
import {CalendarGridComponent} from './view/components/calendar/calendar-grid/calendar-grid.component';
import {CalendarGridDayComponent} from './view/components/calendar/calendar-grid-day/calendar-grid-day.component';
import {CalendarGridQuarterHourComponent} from './view/components/calendar/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component';
import {CalendarItemComponent} from './view/components/calendar/calendar-item/calendar-item.component';
import {ColorService} from './services/ui/color.service';
import {ConfirmationDialogComponent} from './view/dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {ProjectEffortTreeComponent} from './view/components/trees/project-effort-tree/project-effort-tree.component';
import {DailyScrumActivityFragmentComponent} from './view/fragments/daily-scrum-activity-fragment/daily-scrum-activity-fragment.component';
import {DailyScrumFragmentComponent} from './view/fragments/daily-scrum-fragment/daily-scrum-fragment.component';
import {DailyScrumParticipantFragmentComponent} from './view/fragments/daily-scrum-participant-fragment/daily-scrum-participant-fragment.component';
import {DateService} from './services/util/date.service';
import {DateTimePickerFragmentComponent} from './view/fragments/date-time-picker-fragment/date-time-picker-fragment.component';
import {DescriptionFragmentComponent} from './view/fragments/description-fragment/description-fragment.component';
import {DigestService} from './services/entities/digest/digest.service';
import {FileDropFragmentComponent} from './view/fragments/file-drop-fragment/file-drop-fragment.component';
import {FileUploadModule} from 'ng2-file-upload';
import {FilterPersonListComponent} from './view/lists/filter-person-list/filter-person-list.component';
import {FilterPersonListItemComponent} from './view/lists/filter-person-list-item/filter-person-list-item.component';
import {FilterProjectListComponent} from './view/lists/filter-project-list/filter-project-list.component';
import {FilterProjectListItemComponent} from './view/lists/filter-project-list-item/filter-project-list-item.component';
import {FilterTagListComponent} from './view/lists/filter-tag-list/filter-tag-list.component';
import {FilterTagListItemComponent} from './view/lists/filter-tag-list-item/filter-tag-list-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderFragmentComponent} from './view/fragments/header-fragment/header-fragment.component';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {InViewportModule} from 'ng-in-viewport';
import {InformationDialogComponent} from './view/dialogs/other/information-dialog/information-dialog.component';
import {MatchService} from './services/entities/filter/match.service';
import {NewFeaturesDialogComponent} from './view/dialogs/app-info/new-features-dialog/new-features-dialog.component';
import {NgModule} from '@angular/core';
import {PersonAutocompleteFragmentComponent} from './view/fragments/person-autocomplete-fragment/person-autocomplete-fragment.component';
import {PersonChipsFragmentComponent} from './view/fragments/person-chips-fragment/person-chips-fragment.component';
import {PersonDialogComponent} from './view/dialogs/entities/person-dialog/person-dialog.component';
import {PersonFilterDialogComponent} from './view/dialogs/filters/person-filter-dialog/person-filter-dialog.component';
import {PersonListComponent} from './view/lists/person-list/person-list.component';
import {PersonListItemComponent} from './view/lists/person-list-item/person-list-item.component';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {PouchDBSettingsService} from './core/persistence/services/pouchdb-settings.service';
import {PreviousDescriptionFragmentComponent} from './view/fragments/previous-description-fragment/previous-description-fragment.component';
import {ProjectAutocompleteFragmentComponent} from './view/fragments/project-autocomplete-fragment/project-autocomplete-fragment.component';
import {ProjectDialogComponent} from './view/dialogs/entities/project-dialog/project-dialog.component';
import {ProjectFilterDialogComponent} from './view/dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {ProjectListComponent} from './view/lists/project-list/project-list.component';
import {ProjectListDialogComponent} from './view/dialogs/lists/project-list-dialog/project-list-dialog.component';
import {ProjectListItemComponent} from './view/lists/project-list-item/project-list-item.component';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {SettingsService} from './services/persistence/settings.service';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {TagChipsFragmentComponent} from './view/fragments/tag-chips-fragment/tag-chips-fragment.component';
import {TagDialogComponent} from './view/dialogs/entities/tag-dialog/tag-dialog.component';
import {TagFilterDialogComponent} from './view/dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {TagListComponent} from './view/lists/tag-list/tag-list.component';
import {TagListDialogComponent} from './view/dialogs/lists/tag-list-dialog/tag-list-dialog.component';
import {TagListItemComponent} from './view/lists/tag-list-item/tag-list-item.component';
import {TaskAutocompleteFragmentComponent} from './view/fragments/task-autocomplete-fragment/task-autocomplete-fragment.component';
import {TaskDialogComponent} from './view/dialogs/entities/task-dialog/task-dialog.component';
import {TaskListComponent} from './view/lists/task-list/task-list.component';
import {TaskListDialogComponent} from './view/dialogs/lists/task-list-dialog/task-list-dialog.component';
import {TaskListItemComponent} from './view/lists/task-list-item/task-list-item.component';
import {TaskletDailyScrumComponent} from './view/components/tasklet/tasklet-daily-scrum/tasklet-daily-scrum.component';
import {TaskletDialogComponent} from './view/dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {TaskletListComponent} from './view/lists/tasklet-list/tasklet-list.component';
import {TaskletListItemComponent} from './view/lists/tasklet-list-item/tasklet-list-item.component';
import {TaskletService} from './services/entities/tasklet.service';
import {TimePickerDialogComponent} from './view/dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {TimelineComponent} from './view/pages/timeline/timeline.component';
import {TimelineToolbarComponent} from './view/toolbars/timeline-toolbar/timeline-toolbar.component';
import {UploadDialogComponent} from './view/dialogs/other/upload-dialog/upload-dialog.component';
import {MaterialModule} from './ui/material/material.module';
import {UiModule} from './core/ui/ui.module';
import {PersistenceModule} from './core/persistence/persistence.module';

@NgModule({
  declarations: [
    AboutDialogComponent,
    AppComponent,
    CalendarComponent,
    CalendarGridComponent,
    CalendarGridDayComponent,
    CalendarGridQuarterHourComponent,
    CalendarItemComponent,
    ConfirmationDialogComponent,
    ProjectEffortTreeComponent,
    DailyScrumActivityFragmentComponent,
    DailyScrumFragmentComponent,
    DailyScrumParticipantFragmentComponent,
    DateTimePickerFragmentComponent,
    DescriptionFragmentComponent,
    FileDropFragmentComponent,
    FilterPersonListComponent,
    FilterPersonListItemComponent,
    FilterProjectListComponent,
    FilterProjectListItemComponent,
    FilterTagListComponent,
    FilterTagListItemComponent,
    HeaderFragmentComponent,
    InformationDialogComponent,
    NewFeaturesDialogComponent,
    PersonAutocompleteFragmentComponent,
    PersonChipsFragmentComponent,
    PersonDialogComponent,
    PersonFilterDialogComponent,
    PersonListComponent,
    PersonListItemComponent,
    PreviousDescriptionFragmentComponent,
    ProjectAutocompleteFragmentComponent,
    ProjectDialogComponent,
    ProjectFilterDialogComponent,
    ProjectListComponent,
    ProjectListDialogComponent,
    ProjectListItemComponent,
    SplashScreenComponent,
    TagChipsFragmentComponent,
    TagDialogComponent,
    TagFilterDialogComponent,
    TagListComponent,
    TagListDialogComponent,
    TagListItemComponent,
    TaskAutocompleteFragmentComponent,
    TaskDialogComponent,
    TaskListComponent,
    TaskListDialogComponent,
    TaskListItemComponent,
    TaskletDailyScrumComponent,
    TaskletDialogComponent,
    TaskletListComponent,
    TaskletListItemComponent,
    TimePickerDialogComponent,
    TimelineComponent,
    TimelineToolbarComponent,
    UploadDialogComponent
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    InViewportModule,
    ReactiveFormsModule,
    ScrollDispatchModule,
    UiModule,
    PersistenceModule
  ],
  entryComponents: [
    AboutDialogComponent,
    ConfirmationDialogComponent,
    InformationDialogComponent,
    NewFeaturesDialogComponent,
    PersonDialogComponent,
    PersonFilterDialogComponent,
    ProjectDialogComponent,
    ProjectFilterDialogComponent,
    ProjectListDialogComponent,
    TagDialogComponent,
    TagFilterDialogComponent,
    TagListDialogComponent,
    TaskDialogComponent,
    TaskListDialogComponent,
    TaskletDialogComponent,
    TimePickerDialogComponent,
    UploadDialogComponent
  ],
  providers: [
    ColorService,
    DateService,
    DigestService,
    MatchService,
    PouchDBService,
    PouchDBSettingsService,
    SettingsService,
    TaskletService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
