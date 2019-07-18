// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getAppTitle() {
    return element(by.css('app-root .appTitle')).getText() as Promise<string>;
  }
}
