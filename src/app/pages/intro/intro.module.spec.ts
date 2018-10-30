import {IntroModule} from './intro.module';

describe('IntroModule', () => {
  let introModule: IntroModule;

  beforeEach(() => {
    introModule = new IntroModule();
  });

  it('should create an instance', () => {
    expect(introModule).toBeTruthy();
  });
});
