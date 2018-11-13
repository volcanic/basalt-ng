import {PomodoroFinishedDialogModule} from './pomodoro-finished-dialog.module';

describe('PomodoroFinishedDialogModule', () => {
  let confirmationDialogModule: PomodoroFinishedDialogModule;

  beforeEach(() => {
    confirmationDialogModule = new PomodoroFinishedDialogModule();
  });

  it('should create an instance', () => {
    expect(confirmationDialogModule).toBeTruthy();
  });
});
