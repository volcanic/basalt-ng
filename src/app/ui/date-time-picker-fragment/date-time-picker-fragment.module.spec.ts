import {DateTimePickerFragmentModule} from './date-time-picker-fragment.module';

describe('DateTimePickerFragmentModule', () => {
  let dateTimePickerFragmentModule: DateTimePickerFragmentModule;

  beforeEach(() => {
    dateTimePickerFragmentModule = new DateTimePickerFragmentModule();
  });

  it('should create an instance', () => {
    expect(DateTimePickerFragmentModule).toBeTruthy();
  });
});
