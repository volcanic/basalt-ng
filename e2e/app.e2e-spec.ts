import {BasaltPage} from './app.po';

describe('basalt App', () => {
  let page: BasaltPage;

  beforeEach(() => {
    page = new BasaltPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual(null);
  });
});
