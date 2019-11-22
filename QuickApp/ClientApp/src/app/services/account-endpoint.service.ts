// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { EndpointBase } from './endpoint-base.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class AccountEndpoint extends EndpointBase {

    private readonly _usersUrl: string = '/api/account/users';
    private readonly _userByUserNameUrl: string = '/api/account/users/username';
    private readonly _currentUserUrl: string = '/api/account/users/me';
    private readonly _currentUserPreferencesUrl: string = '/api/account/users/me/preferences';
    private readonly _unblockUserUrl: string = '/api/account/users/unblock';
    private readonly _rolesUrl: string = '/api/account/roles';
    private readonly _roleByRoleNameUrl: string = '/api/account/roles/name';
    private readonly _permissionsUrl: string = '/api/account/permissions';

    get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
    get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
    get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
    get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
    get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
    get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
    get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
    get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }


    constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
        super(http, authService);
    }


    getUserEndpoint<T>(userId?: string): Observable<T> {
        const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUserEndpoint(userId));
            }));
    }


    getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
        const endpointUrl = `${this.userByUserNameUrl}/${userName}`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUserByUserNameEndpoint(userName));
            }));
    }


    getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        const endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUsersEndpoint(page, pageSize));
            }));
    }


    getNewUserEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this.usersUrl, JSON.stringify(userObject), this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getNewUserEndpoint(userObject));
            }));
    }

    getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
        const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
            }));
    }

    getPatchUpdateUserEndpoint<T>(patch: {}, userId?: string): Observable<T>;
    getPatchUpdateUserEndpoint<T>(value: any, op: string, path: string, from?: any, userId?: string): Observable<T>;
    getPatchUpdateUserEndpoint<T>(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, userId?: string): Observable<T> {
        let endpointUrl: string;
        let patchDocument: {};

        if (path) {
            endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
            patchDocument = from ?
                [{ value: valueOrPatch, path, op: opOrUserId, from }] :
                [{ value: valueOrPatch, path, op: opOrUserId }];
        } else {
            endpointUrl = opOrUserId ? `${this.usersUrl}/${opOrUserId}` : this.currentUserUrl;
            patchDocument = valueOrPatch;
        }

        return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, userId));
            }));
    }


    getUserPreferencesEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.currentUserPreferencesUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUserPreferencesEndpoint());
            }));
    }

    getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
        return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
            }));
    }

    getUnblockUserEndpoint<T>(userId: string): Observable<T> {
        const endpointUrl = `${this.unblockUserUrl}/${userId}`;

        return this.http.put<T>(endpointUrl, null, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUnblockUserEndpoint(userId));
            }));
    }

    getDeleteUserEndpoint<T>(userId: string): Observable<T> {
        const endpointUrl = `${this.usersUrl}/${userId}`;

        return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getDeleteUserEndpoint(userId));
            }));
    }





    getRoleEndpoint<T>(roleId: string): Observable<T> {
        const endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getRoleEndpoint(roleId));
            }));
    }


    getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
        const endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
            }));
    }



    getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        const endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
            }));
    }

    getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

        return this.http.post<T>(this.rolesUrl, JSON.stringify(roleObject), this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
            }));
    }

    getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
        const endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
            }));
    }

    getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
        const endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
            }));
    }


    getPermissionsEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.permissionsUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
                return this.handleError(error, () => this.getPermissionsEndpoint());
            }));
    }
}
