// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

import fallbackLangData from '../../../public/locale/en.json';

@Injectable({
  providedIn: 'root'
})
export class AppTranslationService {
  private translate = inject(TranslateService);

  languageChanged$ = this.translate.onLangChange.asObservable();

  constructor() {
    this.addLanguages(['en', 'fr', 'de', 'es', 'pt', 'zh', 'ko', 'ar']);
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

    if (browserLang?.match(/en|fr|de|es|pt|zh|ko|ar/)) {
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

    setTimeout(() => { this.translate.use(language); });

    return language;
  }

  getTranslation(key: string | string[], interpolateParams?: object) {
    return this.translate.instant(key, interpolateParams);
  }

  getTranslationAsync(key: string | string[], interpolateParams?: object) {
    return this.translate.get(key, interpolateParams);
  }
}


export class TranslateLanguageLoader implements TranslateLoader {
  http = inject(HttpClient);

  public getTranslation(lang: string) {
    if (lang === 'en')
      return of(fallbackLangData);

    return this.http.get(`/locale/${lang}.json`);
  }
}
