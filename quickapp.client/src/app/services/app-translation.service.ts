// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';

import * as fallbackLangData from '../../assets/locale/en.json';


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

    if (browserLang?.match(/en|fr|de|pt|ar|ko/)) {
      this.changeLanguage(browserLang);
      return browserLang;
    }
  }

  useDefaultLanguage() {
    return this.changeLanguage(null);
  }

  changeLanguage(language: string | null) {
    if (!language) {
      language = this.getDefaultLanguage();
    }

    if (language !== this.translate.currentLang) {
      const lang = language;

      setTimeout(() => {
        this.translate.use(lang);
        this.onLanguageChanged.next(lang);
      });
    }

    return language;
  }

  getTranslation(key: string | Array<string>, interpolateParams?: object) {
    return this.translate.instant(key, interpolateParams);
  }

  getTranslationAsync(key: string | Array<string>, interpolateParams?: object) {
    return this.translate.get(key, interpolateParams);
  }
}


export class TranslateLanguageLoader implements TranslateLoader {
  http = inject(HttpClient);

  public getTranslation(lang: string) {
    if (lang === 'en')
      return of(fallbackLangData);

    return this.http.get(`/assets/locale/${lang}.json`);
  }
}
