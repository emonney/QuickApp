// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class AccountEndpoint extends EndpointFactory {

    private readonly _usersUrl: string = "/api/account/users";
    private readonly _userByUserNameUrl: string = "/api/account/users/username";
    private readonly _currentUserUrl: string = "/api/account/users/me";
    private readonly _currentUserPreferencesUrl: string = "/api/account/users/me/preferences";
    private readonly _unblockUserUrl: string = "/api/account/users/unblock";
    private readonly _rolesUrl: string = "/api/account/roles";
    private readonly _roleByRoleNameUrl: string = "/api/account/roles/name";
    private readonly _permissionsUrl: string = "/api/account/permissions";

    get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
    get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
    get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
    get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
    get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
    get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
    get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
    get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }



    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }




    getUserEndpoint<T>(userId?: string): Observable<T> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUserEndpoint(userId));
            });
    }


    getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
        let endpointUrl = `${this.userByUserNameUrl}/${userName}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUserByUserNameEndpoint(userName));
            });
    }


    getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUsersEndpoint(page, pageSize));
            });
    }


    getNewUserEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this.usersUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewUserEndpoint(userObject));
            });
    }

    getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
            });
    }

    getPatchUpdateUserEndpoint<T>(patch: {}, userId?: string): Observable<T>
    getPatchUpdateUserEndpoint<T>(value: any, op: string, path: string, from?: any, userId?: string): Observable<T>
    getPatchUpdateUserEndpoint<T>(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, userId?: string): Observable<T> {
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

        return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, userId));
            });
    }


    getUserPreferencesEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.currentUserPreferencesUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUserPreferencesEndpoint());
            });
    }

    getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
        return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
            });
    }

    getUnblockUserEndpoint<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.unblockUserUrl}/${userId}`;

        return this.http.put<T>(endpointUrl, null, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUnblockUserEndpoint(userId));
            });
    }

    getDeleteUserEndpoint<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.usersUrl}/${userId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteUserEndpoint(userId));
            });
    }





    getRoleEndpoint<T>(roleId: string): Observable<T> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getRoleEndpoint(roleId));
            });
    }


    getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
        let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
            });
    }



    getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
            });
    }

    getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

        return this.http.post<T>(this.rolesUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
            });
    }

    getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
            });
    }

    getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
            });
    }


    getPermissionsEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.permissionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPermissionsEndpoint());
            });
    }
}
