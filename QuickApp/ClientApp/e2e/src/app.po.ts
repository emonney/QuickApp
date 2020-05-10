// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getAppTitle(): Promise<string> {
    return element(by.css('app-root .appTitle')).getText() as Promise<string>;
  }
}
