import {ProjectPickerModule} from './project-picker.module';

describe('ProjectPickerModule', () => {
  let projectPickerModule: ProjectPickerModule;

  beforeEach(() => {
    projectPickerModule = new ProjectPickerModule();
  });

  it('should create an instance', () => {
    expect(projectPickerModule).toBeTruthy();
  });
});
