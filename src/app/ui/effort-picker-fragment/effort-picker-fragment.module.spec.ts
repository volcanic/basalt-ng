import { EffortPickerFragmentModule } from './effort-picker-fragment.module';

describe('EffortPickerFragmentModule', () => {
  let effortPickerFragmentModule: EffortPickerFragmentModule;

  beforeEach(() => {
    effortPickerFragmentModule = new EffortPickerFragmentModule();
  });

  it('should create an instance', () => {
    expect(effortPickerFragmentModule).toBeTruthy();
  });
});
