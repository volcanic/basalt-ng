import { TagChipsModule } from './tag-chips.module';

describe('TagChipsModule', () => {
  let tagChipsModule: TagChipsModule;

  beforeEach(() => {
    tagChipsModule = new TagChipsModule();
  });

  it('should create an instance', () => {
    expect(tagChipsModule).toBeTruthy();
  });
});
