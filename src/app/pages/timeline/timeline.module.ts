import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {InViewportModule} from 'ng-in-viewport';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {FileDropFragmentModule} from '../../ui/file-drop-fragment/file-drop-fragment.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {MaterialModule} from '../../ui/material/material.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {PersonDialogComponent} from './components/dialogs/person-dialog/person-dialog.component';
import {PersonFilterDialogComponent} from './components/dialogs/person-filter-dialog/person-filter-dialog.component';
import {ProjectDialogComponent} from './components/dialogs/project-dialog/project-dialog.component';
import {ProjectFilterDialogComponent} from './components/dialogs/project-filter-dialog/project-filter-dialog.component';
import {ProjectListDialogComponent} from './components/dialogs/project-list-dialog/project-list-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {TagFilterDialogComponent} from './components/dialogs/tag-filter-dialog/tag-filter-dialog.component';
import {TagListDialogComponent} from './components/dialogs/tag-list-dialog/tag-list-dialog.component';
import {TaskDialogComponent} from './components/dialogs/task-dialog/task-dialog.component';
import {TaskListDialogComponent} from './components/dialogs/task-list-dialog/task-list-dialog.component';
import {TaskletDialogComponent} from './components/dialogs/tasklet-dialog/tasklet-dialog.component';
import {UploadDialogComponent} from './components/dialogs/upload-dialog/upload-dialog.component';
import {DailyScrumActivityFragmentComponent} from './components/fragments/daily-scrum-activity-fragment/daily-scrum-activity-fragment.component';
import {DailyScrumFragmentComponent} from './components/fragments/daily-scrum-fragment/daily-scrum-fragment.component';
import {DailyScrumParticipantFragmentComponent} from './components/fragments/daily-scrum-participant-fragment/daily-scrum-participant-fragment.component';
import {DescriptionFragmentComponent} from './components/fragments/description-fragment/description-fragment.component';
import {HeaderFragmentComponent} from './components/fragments/header-fragment/header-fragment.component';
import {PersonAutocompleteFragmentComponent} from './components/fragments/person-autocomplete-fragment/person-autocomplete-fragment.component';
import {PersonChipsFragmentComponent} from './components/fragments/person-chips-fragment/person-chips-fragment.component';
import {PreviousDescriptionFragmentComponent} from './components/fragments/previous-description-fragment/previous-description-fragment.component';
import {ProjectAutocompleteFragmentComponent} from './components/fragments/project-autocomplete-fragment/project-autocomplete-fragment.component';
import {TagChipsFragmentComponent} from './components/fragments/tag-chips-fragment/tag-chips-fragment.component';
import {TaskAutocompleteFragmentComponent} from './components/fragments/task-autocomplete-fragment/task-autocomplete-fragment.component';
import {FilterPersonListItemComponent} from './components/lists/filter-person-list-item/filter-person-list-item.component';
import {FilterPersonListComponent} from './components/lists/filter-person-list/filter-person-list.component';
import {FilterProjectListItemComponent} from './components/lists/filter-project-list-item/filter-project-list-item.component';
import {FilterProjectListComponent} from './components/lists/filter-project-list/filter-project-list.component';
import {FilterTagListItemComponent} from './components/lists/filter-tag-list-item/filter-tag-list-item.component';
import {FilterTagListComponent} from './components/lists/filter-tag-list/filter-tag-list.component';
import {PersonListItemComponent} from './components/lists/person-list-item/person-list-item.component';
import {PersonListComponent} from './components/lists/person-list/person-list.component';
import {ProjectListItemComponent} from './components/lists/project-list-item/project-list-item.component';
import {ProjectListComponent} from './components/lists/project-list/project-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TaskListItemComponent} from './components/lists/task-list-item/task-list-item.component';
import {TaskListComponent} from './components/lists/task-list/task-list.component';
import {TaskletListItemComponent} from './components/lists/tasklet-list-item/tasklet-list-item.component';
import {TaskletListComponent} from './components/lists/tasklet-list/tasklet-list.component';
import {TaskletDailyScrumComponent} from './components/tasklet-daily-scrum/tasklet-daily-scrum.component';
import {TimelineToolbarComponent} from './components/toolbars/timeline-toolbar/timeline-toolbar.component';
import {ProjectEffortTreeComponent} from './components/trees/project-effort-tree/project-effort-tree.component';
import {TimelineComponent} from './pages/timeline/timeline.component';
import {DateTimePickerDialogModule} from '../../ui/date-time-picker-dialog/date-time-picker-dialog.module';
import {DateTimePickerFragmentModule} from '../../ui/date-time-picker-fragment/date-time-picker-fragment.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimelineRoutingModule} from './timeline-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InViewportModule,
    ScrollDispatchModule,
    MaterialModule,

    TimelineRoutingModule,

    AboutDialogModule,
    ConfirmationDialogModule,
    FileDropFragmentModule,
    InformationDialogModule,
    NewFeaturesDialogModule,
    DateTimePickerDialogModule,
    DateTimePickerFragmentModule
  ],
  declarations: [
    // Page
    TimelineComponent,
    TimelineToolbarComponent,

    // Dialogs
    PersonDialogComponent,
    PersonFilterDialogComponent,

    ProjectDialogComponent,
    ProjectListDialogComponent,
    ProjectFilterDialogComponent,

    TagDialogComponent,
    TagListDialogComponent,
    TagFilterDialogComponent,

    TaskDialogComponent,
    TaskListDialogComponent,
    TaskletDialogComponent,

    TaskletDialogComponent,

    UploadDialogComponent,

    // Lists
    PersonListComponent,
    PersonListItemComponent,
    FilterPersonListComponent,
    FilterPersonListItemComponent,

    ProjectListComponent,
    ProjectListItemComponent,
    FilterProjectListComponent,
    FilterProjectListItemComponent,

    TagListComponent,
    TagListItemComponent,
    FilterTagListComponent,
    FilterTagListItemComponent,

    TaskListComponent,
    TaskListItemComponent,

    TaskletListComponent,
    TaskletListItemComponent,

    // Trees
    ProjectEffortTreeComponent,

    // Fragments
    DailyScrumActivityFragmentComponent,
    DailyScrumFragmentComponent,
    DailyScrumParticipantFragmentComponent,
    DescriptionFragmentComponent,
    HeaderFragmentComponent,
    PersonAutocompleteFragmentComponent,
    PersonChipsFragmentComponent,
    PreviousDescriptionFragmentComponent,
    ProjectAutocompleteFragmentComponent,
    TagChipsFragmentComponent,
    TaskAutocompleteFragmentComponent,

    // Other
    TaskletDailyScrumComponent,
  ], entryComponents: [
    PersonDialogComponent,
    PersonFilterDialogComponent,

    ProjectDialogComponent,
    ProjectListDialogComponent,
    ProjectFilterDialogComponent,

    TagDialogComponent,
    TagListDialogComponent,
    TagFilterDialogComponent,

    TaskDialogComponent,
    TaskListDialogComponent,
    TaskletDialogComponent,

    TaskletDialogComponent,

    UploadDialogComponent
  ], exports: [
    TimelineComponent
  ]
})
/**
 * Contains timeline page
 */
export class TimelineModule {
}
