// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EndpointBase } from './endpoint-base.service';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AccountEndpoint extends EndpointBase {
  private http = inject(HttpClient);
  private configurations = inject(ConfigurationService);

  get usersUrl() { return this.configurations.baseUrl + '/api/account/users'; }
  get userByUserNameUrl() { return this.configurations.baseUrl + '/api/account/users/username'; }
  get currentUserUrl() { return this.configurations.baseUrl + '/api/account/users/me'; }
  get currentUserPreferencesUrl() { return this.configurations.baseUrl + '/api/account/users/me/preferences'; }
  get unblockUserUrl() { return this.configurations.baseUrl + '/api/account/users/unblock'; }
  get rolesUrl() { return this.configurations.baseUrl + '/api/account/roles'; }
  get roleByRoleNameUrl() { return this.configurations.baseUrl + '/api/account/roles/name'; }
  get permissionsUrl() { return this.configurations.baseUrl + '/api/account/permissions'; }

  getUserEndpoint<T>(userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUserEndpoint<T>(userId));
      }));
  }

  getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
    const endpointUrl = `${this.userByUserNameUrl}/${userName}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUserByUserNameEndpoint<T>(userName));
      }));
  }

  getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUsersEndpoint<T>(page, pageSize));
      }));
  }

  getNewUserEndpoint<T>(user: object): Observable<T> {
    return this.http.post<T>(this.usersUrl, JSON.stringify(user), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getNewUserEndpoint<T>(user));
      }));
  }

  getUpdateUserEndpoint<T>(user: object, userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

    return this.http.put<T>(endpointUrl, JSON.stringify(user), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateUserEndpoint<T>(user, userId));
      }));
  }

  getPatchUpdateUserEndpoint<T>(patch: object | object[], userId?: string): Observable<T>;
  getPatchUpdateUserEndpoint<T>(value: unknown, op: string, path: string, from?: string, userId?: string): Observable<T>;
  getPatchUpdateUserEndpoint<T>(valueOrPatch: unknown, opOrUserId?: string, path?: string, from?: string, userId?: string): Observable<T> {
    let endpointUrl: string;
    let patchDocument: unknown;

    if (path) {
      endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
      patchDocument = from ? [{ op: opOrUserId, from: from, path: path }] : [{ op: opOrUserId, path: path, value: valueOrPatch }];
    } else {
      endpointUrl = opOrUserId ? `${this.usersUrl}/${opOrUserId}` : this.currentUserUrl;
      patchDocument = valueOrPatch;
    }

    return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getPatchUpdateUserEndpoint<T>(valueOrPatch, opOrUserId as string, path as string, from, userId));
      }));
  }


  getUserPreferencesEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.currentUserPreferencesUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUserPreferencesEndpoint<T>());
      }));
  }

  getUpdateUserPreferencesEndpoint<T>(configuration: string | null): Observable<T> {
    return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint<T>(configuration));
      }));
  }

  getUnblockUserEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.unblockUserUrl}/${userId}`;

    return this.http.put<T>(endpointUrl, null, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUnblockUserEndpoint<T>(userId));
      }));
  }

  getDeleteUserEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.usersUrl}/${userId}`;

    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteUserEndpoint<T>(userId));
      }));
  }


  getRoleEndpoint<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getRoleEndpoint<T>(roleId));
      }));
  }

  getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
    const endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getRoleByRoleNameEndpoint<T>(roleName));
      }));
  }

  getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getRolesEndpoint<T>(page, pageSize));
      }));
  }

  getNewRoleEndpoint<T>(role: object): Observable<T> {
    return this.http.post<T>(this.rolesUrl, JSON.stringify(role), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getNewRoleEndpoint<T>(role));
      }));
  }

  getUpdateRoleEndpoint<T>(role: object, roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.put<T>(endpointUrl, JSON.stringify(role), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateRoleEndpoint<T>(role, roleId));
      }));
  }

  getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteRoleEndpoint<T>(roleId));
      }));
  }

  getPermissionsEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.permissionsUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getPermissionsEndpoint<T>());
      }));
  }
}
