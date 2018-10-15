import {SuggestedActionButtonModule} from './suggested-action-button.module';

describe('SuggestedActionButtonModule', () => {
  let suggestedTaskButtonModule: SuggestedActionButtonModule;

  beforeEach(() => {
    suggestedTaskButtonModule = new SuggestedActionButtonModule();
  });

  it('should create an instance', () => {
    expect(suggestedTaskButtonModule).toBeTruthy();
  });
});
