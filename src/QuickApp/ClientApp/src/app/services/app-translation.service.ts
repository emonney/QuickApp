// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable } from '@angular/core';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';



@Injectable()
export class AppTranslationService {

  readonly defaultLanguage = "en";
  private onLanguageChanged = new Subject<string>();
  languageChanged$ = this.onLanguageChanged.asObservable();

  constructor(private translate: TranslateService) {

    this.setDefaultLanguage(this.defaultLanguage);
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


  useBrowserLanguage(): string | void {
    let browserLang = this.getBrowserLanguage();

    if (browserLang.match(/en|fr|de|ar|ko|pt/)) {
      this.changeLanguage(browserLang);
      return browserLang;
    }
  }

  changeLanguage(language: string = "en") {

    if (!language)
      language = this.translate.defaultLang;

    if (language != this.translate.currentLang) {
      setTimeout(() => {
        this.translate.use(language);
        this.onLanguageChanged.next(language);
      });
    }

    return language;
  }


  getTranslation(key: string | Array<string>, interpolateParams?: Object): string | any {
    return this.translate.instant(key, interpolateParams);
  }


  getTranslationAsync(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }

}




export class TranslateLanguageLoader implements TranslateLoader {

  /**
   * Gets the translations from webpack
   * @param lang
   * @returns {any}
   */
  public getTranslation(lang: string): any {

    //Note Dynamic require(variable) will not work. Require is always at compile time

    switch (lang) {
      case "en":
        return of(require("../assets/locale/en.json"));
      case "fr":
        return of(require("../assets/locale/fr.json"));
      case "de":
        return of(require("../assets/locale/de.json"));
      case "pt":
        return of(require("../assets/locale/pt.json"));
      case "ar":
        return of(require("../assets/locale/ar.json"));
      case "ko":
        return of(require("../assets/locale/ko.json"));
      default:
    }
  }
}
