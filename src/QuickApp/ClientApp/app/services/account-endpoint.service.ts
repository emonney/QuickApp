// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
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



    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
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


    getNewUserEndpoint(userObject: any): Observable<Response> {

        return this.http.post(this.usersUrl, JSON.stringify(userObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewUserEndpoint(userObject));
            });
    }

    getUpdateUserEndpoint(userObject: any, userId?: string): Observable<Response> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.put(endpointUrl, JSON.stringify(userObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
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

    getNewRoleEndpoint(roleObject: any): Observable<Response> {

        return this.http.post(this.rolesUrl, JSON.stringify(roleObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
            });
    }

    getUpdateRoleEndpoint(roleObject: any, roleId: string): Observable<Response> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
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
}