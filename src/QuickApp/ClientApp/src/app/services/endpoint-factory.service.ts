// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class EndpointFactory {

    static readonly apiVersion: string = "1";

    private readonly _loginUrl: string = "/connect/token";

    private get loginUrl() { return this.configurations.baseUrl + this._loginUrl; }



    private taskPauser: Subject<any>;
    private isRefreshingLogin: boolean;

    private _authService: AuthService;

    private get authService() {
        if (!this._authService)
            this._authService = this.injector.get(AuthService);

        return this._authService;
    }



    constructor(protected http: HttpClient, protected configurations: ConfigurationService, private injector: Injector) {

    }


    getLoginEndpoint<T>(userName: string, password: string): Observable<T> {

        let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        let params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('grant_type', 'password')
            .append('scope', 'openid email phone profile offline_access roles')
            .append('resource', window.location.origin);

        let requestBody = params.toString();

        return this.http.post<T>(this.loginUrl, requestBody, { headers: header });
    }


    getRefreshLoginEndpoint<T>(): Observable<T> {

        let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        let params = new HttpParams()
            .append('refresh_token', this.authService.refreshToken)
            .append('grant_type', 'refresh_token')
            .append('scope', 'openid email phone profile offline_access roles');

        let requestBody = params.toString();

        return this.http.post<T>(this.loginUrl, requestBody, { headers: header })
            .catch(error => {
                return this.handleError(error, () => this.getRefreshLoginEndpoint());
            });
    }



    protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
        let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            'Accept': `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
            'App-Version': ConfigurationService.appVersion
        });

        return { headers: headers };
    }



    protected handleError(error, continuation: () => Observable<any>) {

        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }

            this.isRefreshingLogin = true;

            return this.authService.refreshLogin()
                .mergeMap(data => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(true);

                    return continuation();
                })
                .catch(refreshLoginError => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(false);

                    if (refreshLoginError.status == 401 || (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(this.loginUrl.toLowerCase()))) {
                        this.authService.reLogin();
                        return Observable.throw('session expired');
                    }
                    else {
                        return Observable.throw(refreshLoginError || 'server error');
                    }
                });
        }

        if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
            this.authService.reLogin();

            return Observable.throw((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return Observable.throw(error);
        }
    }



    private pauseTask(continuation: () => Observable<any>) {
        if (!this.taskPauser)
            this.taskPauser = new Subject();

        return this.taskPauser.switchMap(continueOp => {
            return continueOp ? continuation() : Observable.throw('session expired');
        });
    }


    private resumeTasks(continueOp: boolean) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }
}
