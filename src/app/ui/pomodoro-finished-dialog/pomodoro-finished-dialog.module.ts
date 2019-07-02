import {NgModule} from '@angular/core';
import {PomodoroFinishedDialogComponent} from './pomodoro-finished-dialog/pomodoro-finished-dialog.component';
import {PomodoroFinishedDialogDeclarations} from './pomodoro-finished-dialog.declaration';
import {PomodoroFinishedDialogImports} from './pomodoro-finished-dialog.imports';

@NgModule({
  imports: [PomodoroFinishedDialogImports],
  declarations: [PomodoroFinishedDialogDeclarations],
  entryComponents: [
    PomodoroFinishedDialogComponent
  ],
  exports: [
    PomodoroFinishedDialogComponent
  ]
})
export class PomodoroFinishedDialogModule {
}
