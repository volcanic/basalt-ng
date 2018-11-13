import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PomodoroFinishedDialogComponent} from './pomodoro-finished-dialog/pomodoro-finished-dialog.component';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    PomodoroFinishedDialogComponent
  ],
  entryComponents: [
    PomodoroFinishedDialogComponent
  ],
  exports: [
    PomodoroFinishedDialogComponent
  ]
})
export class PomodoroFinishedDialogModule {
}
