import { PersonIndicatorButtonModule } from './person-indicator-button.module';

describe('PersonIndicatorButtonModule', () => {
  let personIndicatorButtonModule: PersonIndicatorButtonModule;

  beforeEach(() => {
    personIndicatorButtonModule = new PersonIndicatorButtonModule();
  });

  it('should create an instance', () => {
    expect(personIndicatorButtonModule).toBeTruthy();
  });
});
