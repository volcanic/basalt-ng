import { MarkdownFragmentModule } from './markdown-fragment.module';

describe('MarkdownFragmentModule', () => {
  let markdownFragmentModule: MarkdownFragmentModule;

  beforeEach(() => {
    markdownFragmentModule = new MarkdownFragmentModule();
  });

  it('should create an instance', () => {
    expect(markdownFragmentModule).toBeTruthy();
  });
});
