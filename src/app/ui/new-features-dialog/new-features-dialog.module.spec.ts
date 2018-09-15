import {NewFeaturesDialogModule} from './new-features-dialog.module';

describe('NewFeaturesDialogModule', () => {
  let newFeaturesDialogModule: NewFeaturesDialogModule;

  beforeEach(() => {
    newFeaturesDialogModule = new NewFeaturesDialogModule();
  });

  it('should create an instance', () => {
    expect(newFeaturesDialogModule).toBeTruthy();
  });
});
