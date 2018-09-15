import {DateTimePickerDialogModule} from './date-time-picker-dialog.module';

describe('DateTimePickerDialogModule', () => {
  let dateTimePickerDialogModule: DateTimePickerDialogModule;

  beforeEach(() => {
    dateTimePickerDialogModule = new DateTimePickerDialogModule();
  });

  it('should create an instance', () => {
    expect(DateTimePickerDialogModule).toBeTruthy();
  });
});
