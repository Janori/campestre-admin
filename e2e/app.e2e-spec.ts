import { CampestreAdminPage } from './app.po';

describe('campestre-admin App', () => {
  let page: CampestreAdminPage;

  beforeEach(() => {
    page = new CampestreAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
