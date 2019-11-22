// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

import { LocalStoreManager } from './local-store-manager.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { LoginResponse } from '../models/login-response.model';

@Injectable()
export class OidcHelperService {

    private get baseUrl() { return this.configurations.baseUrl; }
    private clientId = 'quickapp_spa';
    private scope = 'openid email phone profile offline_access roles quickapp_api';

    constructor(
        private http: HttpClient,
        private oauthService: OAuthService,
        private configurations: ConfigurationService,
        private localStorage: LocalStoreManager) {

    }


    loginWithPassword(userName: string, password: string) {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', this.clientId)
            .append('grant_type', 'password')
            .append('scope', this.scope);

        this.oauthService.issuer = this.baseUrl;

        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(() => {
                return this.http.post<LoginResponse>(this.oauthService.tokenEndpoint, params, { headers: header });
            }));
    }

    refreshLogin() {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');

        this.oauthService.issuer = this.baseUrl;

        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(() => {
                return this.http.post<LoginResponse>(this.oauthService.tokenEndpoint, params, { headers: header });
            }));
    }

    get accessToken(): string {
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }

    get accessTokenExpiryDate(): Date {
        return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
    }

    get refreshToken(): string {
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }

    get isSessionExpired(): boolean {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }

        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }
}
