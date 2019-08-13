import {MainComponent} from './pages/main/main.component';
import {TimelineComponent} from './pages/timeline/timeline.component';
import {TimelineToolbarComponent} from './components/toolbars/timeline-toolbar/timeline-toolbar.component';
import {TaskletComponent} from './pages/tasklet/tasklet.component';
import {TaskletToolbarComponent} from './components/toolbars/tasklet-toolbar/tasklet-toolbar.component';
import {TaskComponent} from './pages/task/task.component';
import {TaskToolbarComponent} from './components/toolbars/task-toolbar/task-toolbar.component';
import {PersonDialogComponent} from './components/dialogs/person-dialog/person-dialog.component';
import {ProjectDialogComponent} from './components/dialogs/project-dialog/project-dialog.component';
import {ProjectListDialogComponent} from './components/dialogs/project-list-dialog/project-list-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {TagListDialogComponent} from './components/dialogs/tag-list-dialog/tag-list-dialog.component';
import {UnusedTagsDialogComponent} from './components/dialogs/unused-tags-dialog/unused-tags-dialog.component';
import {TaskDialogComponent} from './components/dialogs/task-dialog/task-dialog.component';
import {TaskListDialogComponent} from './components/dialogs/task-list-dialog/task-list-dialog.component';
import {TaskletDialogComponent} from './components/dialogs/tasklet-dialog/tasklet-dialog.component';
import {UploadDialogComponent} from './components/dialogs/upload-dialog/upload-dialog.component';
import {PersonListComponent} from './components/lists/person-list/person-list.component';
import {PersonListItemComponent} from './components/lists/person-list-item/person-list-item.component';
import {ProjectListComponent} from './components/lists/project-list/project-list.component';
import {ProjectListItemComponent} from './components/lists/project-list-item/project-list-item.component';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';
import {TaskListComponent} from './components/lists/task-list/task-list.component';
import {TaskListItemComponent} from './components/lists/task-list-item/task-list-item.component';
import {TaskletListComponent} from './components/lists/tasklet-list/tasklet-list.component';
import {TaskletListItemComponent} from './components/lists/tasklet-list-item/tasklet-list-item.component';
import {ProjectEffortTreeComponent} from './components/trees/project-effort-tree/project-effort-tree.component';
import {DailyScrumFragmentComponent} from './components/fragments/dialog/daily-scrum-fragment/daily-scrum-fragment.component';
import {DailyScrumItemFragmentComponent} from './components/fragments/dialog/daily-scrum-item-fragment/daily-scrum-item-fragment.component';
import {FileDropFragmentComponent} from './components/fragments/other/file-drop-fragment/file-drop-fragment.component';
import {TaskletPreviewFragmentComponent} from './components/fragments/tasklet/tasklet-preview-fragment/tasklet-preview-fragment.component';
import {MeetingMinutesFragmentComponent} from './components/fragments/dialog/meeting-minutes-fragment/meeting-minutes-fragment.component';
// tslint:disable-next-line:max-line-length max-line-length
import {MeetingMinuteItemFragmentComponent} from './components/fragments/dialog/meeting-minute-item-fragment/meeting-minute-item-fragment.component';
// tslint:disable-next-line:max-line-length
import {PersonAutocompleteFragmentComponent} from './components/fragments/dialog/person-autocomplete-fragment/person-autocomplete-fragment.component';
// tslint:disable-next-line:max-line-length max-line-length
import {ProjectAutocompleteFragmentComponent} from './components/fragments/dialog/project-autocomplete-fragment/project-autocomplete-fragment.component';
// tslint:disable-next-line:max-line-length
import {RecurrenceIntervalFragmentComponent} from './components/fragments/dialog/recurrence-interval-fragment/recurrence-interval-fragment.component';
import {RelativeTimeFragmentComponent} from './components/fragments/tasklet/relative-time-fragment/relative-time-fragment.component';
import {TaskletCardFragmentComponent} from './components/fragments/tasklet/tasklet-card-fragment/tasklet-card-fragment.component';
import {TaskletContentFragmentComponent} from './components/fragments/tasklet/tasklet-content-fragment/tasklet-content-fragment.component';
// tslint:disable-next-line:max-line-length max-line-length
import {TaskletDailyScrumFragmentComponent} from './components/fragments/tasklet/tasklet-daily-scrum-fragment/tasklet-daily-scrum-fragment.component';
// tslint:disable-next-line:max-line-length
import {TaskletDailyScrumItemFragmentComponent} from './components/fragments/tasklet/tasklet-daily-scrum-item-fragment/tasklet-daily-scrum-item-fragment.component';
// tslint:disable-next-line:max-line-length max-line-length
import {TaskletMeetingMinuteItemFragmentComponent} from './components/fragments/tasklet/tasklet-meeting-minute-item-fragment/tasklet-meeting-minute-item-fragment.component';
// tslint:disable-next-line:max-line-length
import {TaskletMeetingMinutesFragmentComponent} from './components/fragments/tasklet/tasklet-meeting-minutes-fragment/tasklet-meeting-minutes-fragment.component';
// tslint:disable-next-line:max-line-length
import {TaskletTimelineFragmentComponent} from './components/fragments/tasklet/tasklet-timeline-fragment/tasklet-timeline-fragment.component';
import {TaskletTypeFragmentComponent} from './components/fragments/dialog/tasklet-type-fragment/tasklet-type-fragment.component';
import {PomodoroTimerComponent} from './components/fragments/other/pomodoro-timer/pomodoro-timer.component';
import {TaskTitleFormComponent} from './components/fragments/forms/task-title-form/task-title-form.component';
import {TaskPropertiesFormComponent} from './components/fragments/forms/task-properties-form/task-properties-form.component';
import {SuggestedActionsComponent} from './components/fragments/other/suggested-actions/suggested-actions.component';
import {TagNamesPipe} from './pipes/tag-names.pipe';
import {PersonNamesPipe} from './pipes/person-names.pipe';
import {ColorPopoverComponent} from './components/popovers/color-popover/color-popover.component';
import {BaseComponent} from './pages/base/base.component';
import {DigestFragmentComponent} from './components/fragments/other/digest-fragment/digest-fragment.component';

/** Declarations for timeline module */
export const TimelineDeclarations = [
  // Page
  BaseComponent,
  MainComponent,
  TimelineComponent,
  TimelineToolbarComponent,
  TaskletComponent,
  TaskletToolbarComponent,
  TaskComponent,
  TaskToolbarComponent,

  // Dialogs
  PersonDialogComponent,

  ProjectDialogComponent,
  ProjectListDialogComponent,

  TagDialogComponent,
  TagListDialogComponent,
  UnusedTagsDialogComponent,

  TaskDialogComponent,
  TaskListDialogComponent,

  TaskletDialogComponent,

  UploadDialogComponent,

  // Lists
  PersonListComponent,
  PersonListItemComponent,

  ProjectListComponent,
  ProjectListItemComponent,

  TagListComponent,
  TagListItemComponent,

  TaskListComponent,
  TaskListItemComponent,

  TaskletListComponent,
  TaskletListItemComponent,

  // Popovers
  ColorPopoverComponent,

  // Trees
  ProjectEffortTreeComponent,

  // Fragments
  DailyScrumFragmentComponent,
  DailyScrumItemFragmentComponent,
  DigestFragmentComponent,
  FileDropFragmentComponent,
  TaskletPreviewFragmentComponent,
  MeetingMinutesFragmentComponent,
  MeetingMinuteItemFragmentComponent,
  PersonAutocompleteFragmentComponent,
  ProjectAutocompleteFragmentComponent,
  RecurrenceIntervalFragmentComponent,
  RelativeTimeFragmentComponent,
  TaskletCardFragmentComponent,
  TaskletContentFragmentComponent,
  TaskletDailyScrumFragmentComponent,
  TaskletDailyScrumItemFragmentComponent,
  TaskletMeetingMinuteItemFragmentComponent,
  TaskletMeetingMinutesFragmentComponent,
  TaskletTimelineFragmentComponent,
  TaskletTypeFragmentComponent,
  PomodoroTimerComponent,
  DailyScrumItemFragmentComponent,
  TaskTitleFormComponent,
  TaskPropertiesFormComponent,
  SuggestedActionsComponent,

  // Pipes
  TagNamesPipe,
  PersonNamesPipe,
];
