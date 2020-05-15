// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';



@Injectable()
export class AppTranslationService {

  private onLanguageChanged = new Subject<string>();
  languageChanged$ = this.onLanguageChanged.asObservable();

  constructor(private translate: TranslateService) {
    this.addLanguages(['en', 'fr', 'de', 'pt', 'ar', 'ko']);
    this.setDefaultLanguage('en');
  }

  addLanguages(lang: string[]) {
    this.translate.addLangs(lang);
  }

  setDefaultLanguage(lang: string) {
    this.translate.setDefaultLang(lang);
  }

  getDefaultLanguage() {
    return this.translate.defaultLang;
  }

  getBrowserLanguage() {
    return this.translate.getBrowserLang();
  }

  getCurrentLanguage() {
    return this.translate.currentLang;
  }

  getLoadedLanguages() {
    return this.translate.langs;
  }

  useBrowserLanguage(): string | void {
    const browserLang = this.getBrowserLanguage();

    if (browserLang.match(/en|fr|de|pt|ar|ko/)) {
      this.changeLanguage(browserLang);
      return browserLang;
    }
  }

  useDefaultLangage() {
    return this.changeLanguage(null);
  }

  changeLanguage(language: string) {
    if (!language) {
      language = this.getDefaultLanguage();
    }

    if (language !== this.translate.currentLang) {
      setTimeout(() => {
        this.translate.use(language);
        this.onLanguageChanged.next(language);
      });
    }

    return language;
  }

  getTranslation(key: string | Array<string>, interpolateParams?: object): string | any {
    return this.translate.instant(key, interpolateParams);
  }

  getTranslationAsync(key: string | Array<string>, interpolateParams?: object): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }

}


export class TranslateLanguageLoader implements TranslateLoader {

  public getTranslation(lang: string): any {
    // Note Dynamic require(variable) will not work. Require is always at compile time
    switch (lang) {
      case 'en':
        return of(require('../assets/locale/en.json'));
      case 'fr':
        return of(require('../assets/locale/fr.json'));
      case 'de':
        return of(require('../assets/locale/de.json'));
      case 'pt':
        return of(require('../assets/locale/pt.json'));
      case 'ar':
        return of(require('../assets/locale/ar.json'));
      case 'ko':
        return of(require('../assets/locale/ko.json'));
      default:
    }
  }
}
