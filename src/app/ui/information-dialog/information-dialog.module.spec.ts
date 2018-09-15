import { InformationDialogModule } from './information-dialog.module';

describe('InformationDialogModule', () => {
  let informationDialogModule: InformationDialogModule;

  beforeEach(() => {
    informationDialogModule = new InformationDialogModule();
  });

  it('should create an instance', () => {
    expect(informationDialogModule).toBeTruthy();
  });
});
