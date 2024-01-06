// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastaModule } from 'ngx-toasta';

import { AuthService } from './services/auth.service';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { ThemeManager } from './services/theme-manager';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService } from './services/oidc-helper.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLanguageLoader
          }
        }),
        NgxDatatableModule,
        ToastaModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AuthService,
        AlertService,
        ConfigurationService,
        ThemeManager,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        OidcHelperService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'QuickApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    expect(app.appTitle).toEqual('QuickApp');
  });

  it('should render Loaded! in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Loaded!');
  });
});
