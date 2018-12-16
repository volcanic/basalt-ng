import { CheckableListModule } from './checkable-list.module';

describe('CheckableListModule', () => {
  let checkableListModule: CheckableListModule;

  beforeEach(() => {
    checkableListModule = new CheckableListModule();
  });

  it('should create an instance', () => {
    expect(checkableListModule).toBeTruthy();
  });
});
