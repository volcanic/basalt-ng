import {TaskAutocompleteModule} from './task-autocomplete.module';

describe('TaskAutocompleteModule', () => {
  let taskAutocompleteModule: TaskAutocompleteModule;

  beforeEach(() => {
    taskAutocompleteModule = new TaskAutocompleteModule();
  });

  it('should create an instance', () => {
    expect(taskAutocompleteModule).toBeTruthy();
  });
});
