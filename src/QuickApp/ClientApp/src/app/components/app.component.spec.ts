/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../components/app.component';
import { LoginComponent } from '../components/login/login.component';
import { NotificationsViewerComponent } from '../components/controls/notifications-viewer.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastaModule } from 'ngx-toasta';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AuthService } from '../services/auth.service';
import { AppTitleService } from '../services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from '../services/app-translation.service';
import { ConfigurationService } from '../services/configuration.service';
import { AlertService } from '../services/alert.service';
import { LocalStoreManager } from '../services/local-store-manager.service';
import { EndpointFactory } from '../services/endpoint-factory.service';
import { NotificationService } from '../services/notification.service';
import { NotificationEndpoint } from '../services/notification-endpoint.service';
import { AccountService } from '../services/account.service';
import { AccountEndpoint } from '../services/account-endpoint.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        ToastaModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        ModalModule.forRoot()
      ],
      declarations: [
        AppComponent,
        LoginComponent,
        NotificationsViewerComponent
      ],
      providers: [
        AuthService,
        AlertService,
        ConfigurationService,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        EndpointFactory
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Quick Application'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = <AppComponent>fixture.debugElement.componentInstance;
    expect(app.appTitle).toEqual('Quick Application');
  });

  it('should render Loaded! in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Loaded!');
  });
});
