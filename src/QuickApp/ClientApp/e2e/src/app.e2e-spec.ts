// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { AppPage } from './app.po';

describe('QuickApp App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display application title: Quick Application', () => {
    page.navigateTo();
    expect(page.getAppTitle()).toEqual('Quick Application');
  });
});
