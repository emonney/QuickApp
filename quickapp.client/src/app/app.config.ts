// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { ApplicationConfig, ErrorHandler, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PreloadAllModules, provideRouter, TitleStrategy, UrlSerializer, withPreloading } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { routes } from './app.routes';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { LowerCaseUrlSerializer } from './services/lowercase-url-serializer.service';
import { AlertService } from './services/alert.service';
import { ThemeManager } from './services/theme-manager';
import { ConfigurationService } from './services/configuration.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService } from './services/oidc-helper.service';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
      })
    ),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: TitleStrategy, useClass: AppTitleService },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    LocalStoreManager,
    ConfigurationService,
    AppTranslationService,
    AlertService,
    OidcHelperService,
    AuthService,
    ThemeManager,
    NotificationEndpoint,
    NotificationService,
    AccountEndpoint,
    AccountService,
    provideAnimations(),
  ]
};
