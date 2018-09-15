import { FileDropFragmentModule } from './file-drop-fragment.module';

describe('FileDropFragmentModule', () => {
  let fileDropFragmentModule: FileDropFragmentModule;

  beforeEach(() => {
    fileDropFragmentModule = new FileDropFragmentModule();
  });

  it('should create an instance', () => {
    expect(fileDropFragmentModule).toBeTruthy();
  });
});
