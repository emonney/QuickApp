// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable } from '@angular/core';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';


@Injectable()
export class AppTranslationService {

    private _languageChanged = new Subject<string>();
    readonly defaultLanguage = "en";

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
                this._languageChanged.next(language);
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



    languageChangedEvent() {
        return this._languageChanged.asObservable();
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
                return Observable.of(require("../assets/locale/en.json"));
            case "fr":
                return Observable.of(require("../assets/locale/fr.json"));
            case "de":
                return Observable.of(require("../assets/locale/de.json"));
            case "pt":
                return Observable.of(require("../assets/locale/pt.json"));
            case "ar":
                return Observable.of(require("../assets/locale/ar.json"));
            case "ko":
                return Observable.of(require("../assets/locale/ko.json"));
            default:
        }
    }
}
