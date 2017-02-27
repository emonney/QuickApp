// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// ======================================

import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
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

    readonly _loginUrl: string = "/connect/token";
    readonly _usersUrl: string = "/api/account/users";
    readonly _userByUserNameUrl: string = "/api/account/users/username";
    readonly _currentUserUrl: string = "/api/account/users/me";
    readonly _currentUserPreferencesUrl: string = "/api/account/users/me/preferences";
    readonly _unblockUserUrl: string = "/api/account/users/unblock";
    readonly _rolesUrl: string = "/api/account/roles";
    readonly _roleByRoleNameUrl: string = "/api/account/roles/name";
    readonly _permissionsUrl: string = "/api/account/permissions";

    get loginUrl() { return this.configurations.baseUrl + this._loginUrl; }
    get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
    get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
    get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
    get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
    get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
    get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
    get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
    get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }



    private taskPauser: Subject<any>;
    private isRefreshingLogin: boolean;

    private _authService: AuthService;

    private get authService() {
        if (!this._authService)
            this._authService = this.injector.get(AuthService);

        return this._authService;
    }



    constructor(private http: Http, private configurations: ConfigurationService, private injector: Injector) {

    }


    getLoginEndpoint(userName: string, password: string): Observable<Response> {

        let header = new Headers();
        header.append("Content-Type", "application/x-www-form-urlencoded");

        let searchParams = new URLSearchParams();
        searchParams.append('username', userName);
        searchParams.append('password', password);
        searchParams.append('grant_type', 'password');
        searchParams.append('scope', 'openid email profile offline_access roles');
        searchParams.append('resource', window.location.origin);

        let requestBody = searchParams.toString();

        return this.http.post(this.loginUrl, requestBody, { headers: header });
    }


    getRefreshLoginEndpoint(): Observable<Response> {

        let header = new Headers();
        header.append("Content-Type", "application/x-www-form-urlencoded");

        let searchParams = new URLSearchParams();
        searchParams.append('refresh_token', this.authService.refreshToken);
        searchParams.append('grant_type', 'refresh_token');
        searchParams.append('scope', 'openid email profile offline_access roles');

        let requestBody = searchParams.toString();

        return this.http.post(this.loginUrl, requestBody, { headers: header })
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getRefreshLoginEndpoint());
            });
    }




    getUserEndpoint(userId?: string): Observable<Response> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUserEndpoint(userId));
            });
    }


    getUserByUserNameEndpoint(userName: string): Observable<Response> {
        let endpointUrl = `${this.userByUserNameUrl}/${userName}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUserByUserNameEndpoint(userName));
            });
    }


    getUsersEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUsersEndpoint(page, pageSize));
            });
    }

    getUpdateUserEndpoint(userObject: any, userId?: string): Observable<Response> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.put(endpointUrl, JSON.stringify(userObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUserEndpoint(userId, userObject));
            });
    }

    getPatchUpdateUserEndpoint(patch: {}, userId?: string): Observable<Response>
    getPatchUpdateUserEndpoint(value: any, op: string, path: string, from?: any, userId?: string): Observable<Response>
    getPatchUpdateUserEndpoint(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, userId?: string): Observable<Response> {
        let endpointUrl: string;
        let patchDocument: {};

        if (path) {
            endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
            patchDocument = from ?
                [{ "value": valueOrPatch, "path": path, "op": opOrUserId, "from": from }] :
                [{ "value": valueOrPatch, "path": path, "op": opOrUserId }];
        }
        else {
            endpointUrl = opOrUserId ? `${this.usersUrl}/${opOrUserId}` : this.currentUserUrl;
            patchDocument = valueOrPatch;
        }

        return this.http.patch(endpointUrl, JSON.stringify(patchDocument), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, userId));
            });
    }

    getNewUserEndpoint(userObject: any): Observable<Response> {

        return this.http.post(this.usersUrl, JSON.stringify(userObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewUserEndpoint(userObject));
            });
    }



    getUserPreferencesEndpoint(): Observable<Response> {

        return this.http.get(this.currentUserPreferencesUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUserPreferencesEndpoint());
            });
    }

    getUpdateUserPreferencesEndpoint(configuration: string): Observable<Response> {
        return this.http.put(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
            });
    }

    getUnblockUserEndpoint(userId: string): Observable<Response> {
        let endpointUrl = `${this.unblockUserUrl}/${userId}`;

        return this.http.put(endpointUrl, null, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUnblockUserEndpoint(userId));
            });
    }

    getDeleteUserEndpoint(userId: string): Observable<Response> {
        let endpointUrl = `${this.usersUrl}/${userId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteUserEndpoint(userId));
            });
    }





    getRoleEndpoint(roleId: string): Observable<Response> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getRoleEndpoint(roleId));
            });
    }


    getRoleByRoleNameEndpoint(roleName: string): Observable<Response> {
        let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
            });
    }



    getRolesEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
            });
    }

    getUpdateRoleEndpoint(roleObject: any, roleId: string): Observable<Response> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateRoleEndpoint(roleId, roleObject));
            });
    }

    getNewRoleEndpoint(roleObject: any): Observable<Response> {

        return this.http.post(this.rolesUrl, JSON.stringify(roleObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
            });
    }

    getDeleteRoleEndpoint(roleId: string): Observable<Response> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
            });
    }


    getPermissionsEndpoint(): Observable<Response> {

        return this.http.get(this.permissionsUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPermissionsEndpoint());
            });
    }





    private getAuthHeader(includeJsonContentType?: boolean): RequestOptions {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.accessToken });

        if (includeJsonContentType)
            headers.append("Content-Type", "application/json");

        headers.append("Accept", `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`);
        headers.append("App-Version", ConfigurationService.appVersion);

        return new RequestOptions({ headers: headers });
    }



    private handleError(error, continuation: () => Observable<any>) {

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
            return Observable.throw('session expired');
        }
        else {
            return Observable.throw(error || 'server error');
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