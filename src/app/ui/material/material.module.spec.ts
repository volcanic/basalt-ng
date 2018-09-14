import {MaterialModule} from './material.module';

describe('MaterialModule', () => {
  let appMaterialModule: MaterialModule;

  beforeEach(() => {
    appMaterialModule = new MaterialModule();
  });

  it('should create an instance', () => {
    expect(appMaterialModule).toBeTruthy();
  });
});
