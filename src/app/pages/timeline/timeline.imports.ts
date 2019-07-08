import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InViewportModule} from 'ng-in-viewport';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {FileUploadModule} from 'ng2-file-upload';
import {TimelineRoutingModule} from './timeline-routing.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {ChatBubbleModule} from '../../ui/chat-bubble/chat-bubble.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {PersonIndicatorButtonModule} from '../../ui/person-indicator-button/person-indicator-button.module';
import {DateTimePickerDialogModule} from '../../ui/date-time-picker-dialog/date-time-picker-dialog.module';
import {DateTimePickerFragmentModule} from '../../ui/date-time-picker-fragment/date-time-picker-fragment.module';
import {EcoFabSpeedDialModule} from '@ecodev/fab-speed-dial';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import {TagChipsModule} from '../../ui/tag-chips/tag-chips.module';
import {TaskAutocompleteModule} from '../../ui/task-autocomplete/task-autocomplete.module';
import {StopWatchModule} from '../../ui/stop-watch/stop-watch.module';
import {MarkdownFragmentModule} from '../../ui/markdown-fragment/markdown-fragment.module';
import {PreviousDescriptionModule} from '../../ui/previous-description/previous-description.module';
import {PomodoroFinishedDialogModule} from '../../ui/pomodoro-finished-dialog/pomodoro-finished-dialog.module';
import {EffortPickerFragmentModule} from '../../ui/effort-picker-fragment/effort-picker-fragment.module';
import {CheckableListModule} from '../../ui/checkable-list/checkable-list.module';
import {MaterialModule} from '../../ui/material/material.module';
import {EntityModule} from '../../core/entity/entity.module';
import {ColorPickerModule} from '../../ui/color-picker/color-picker.module';

/** Imports for timeline module */
export const TimelineImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  InViewportModule,
  ScrollDispatchModule,
  MaterialModule,
  FileUploadModule,

  TimelineRoutingModule,

  EntityModule,

  AboutDialogModule,
  ColorPickerModule,
  ConfirmationDialogModule,
  ChatBubbleModule,
  InformationDialogModule,
  PersonIndicatorButtonModule,
  DateTimePickerDialogModule,
  DateTimePickerFragmentModule,
  EcoFabSpeedDialModule,
  SuggestedActionButtonModule,
  TagChipsModule,
  TaskAutocompleteModule,
  StopWatchModule,
  MarkdownFragmentModule,
  PreviousDescriptionModule,
  PomodoroFinishedDialogModule,
  EffortPickerFragmentModule,
  CheckableListModule
];
