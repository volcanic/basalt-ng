import { AmphibianPage } from './app.po';

describe('amphibian App', function() {
  let page: AmphibianPage;

  beforeEach(() => {
    page = new AmphibianPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
