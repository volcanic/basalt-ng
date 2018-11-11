import {PreviousDescriptionModule} from './previous-description.module';

describe('PreviousDescriptionModule', () => {
  let previousDescriptionModule: PreviousDescriptionModule;

  beforeEach(() => {
    previousDescriptionModule = new PreviousDescriptionModule();
  });

  it('should create an instance', () => {
    expect(previousDescriptionModule).toBeTruthy();
  });
});
