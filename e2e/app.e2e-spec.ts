import { SpiritWebPage } from './app.po';

describe('spirit-web App', () => {
  let page: SpiritWebPage;

  beforeEach(() => {
    page = new SpiritWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
