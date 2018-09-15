import {AboutDialogModule} from './about-dialog.module';

describe('AboutDialogModule', () => {
  let aboutDialogModule: AboutDialogModule;

  beforeEach(() => {
    aboutDialogModule = new AboutDialogModule();
  });

  it('should create an instance', () => {
    expect(aboutDialogModule).toBeTruthy();
  });
});
