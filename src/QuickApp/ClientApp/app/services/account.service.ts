// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { UserEdit } from '../models/user-edit.model';



export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };



@Injectable()
export class AccountService {

    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();


    constructor(private router: Router, private http: Http, private authService: AuthService,
        private endpointFactory: EndpointFactory) {

    }


    getUser(userId?: string) {

        return this.endpointFactory.getUserEndpoint(userId)
            .map((response: Response) => <User>response.json());
    }

    getUserAndRoles(userId?: string) {

        return Observable.forkJoin(
            this.endpointFactory.getUserEndpoint(userId).map((response: Response) => <User>response.json()),
            this.endpointFactory.getRolesEndpoint().map((response: Response) => <Role[]>response.json()));
    }

    getUsers(page?: number, pageSize?: number) {

        return this.endpointFactory.getUsersEndpoint(page, pageSize)
            .map((response: Response) => <User[]>response.json());
    }

    getUsersAndRoles(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.endpointFactory.getUsersEndpoint(page, pageSize).map((response: Response) => <User[]>response.json()),
            this.endpointFactory.getRolesEndpoint().map((response: Response) => <Role[]>response.json()));
    }


    updateUser(user: UserEdit) {
        if (user.id) {
            return this.endpointFactory.getUpdateUserEndpoint(user, user.id);
        }
        else {
            return this.endpointFactory.getUserByUserNameEndpoint(user.userName)
                .map((response: Response) => <User>response.json())
                .mergeMap(foundUser => {
                    user.id = foundUser.id;
                    return this.endpointFactory.getUpdateUserEndpoint(user, user.id)
                });
        }
    }


    newUser(user: UserEdit) {
        return this.endpointFactory.getNewUserEndpoint(user)
            .map((response: Response) => <User>response.json());
    }


    getUserPreferences() {

        return this.endpointFactory.getUserPreferencesEndpoint()
            .map((response: Response) => <string>response.json());
    }

    updateUserPreferences(configuration: string) {
        return this.endpointFactory.getUpdateUserPreferencesEndpoint(configuration);
    }


    deleteUser(userOrUserId: string | UserEdit): Observable<User> {

        if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
            return this.endpointFactory.getDeleteUserEndpoint(<string>userOrUserId)
                .map((response: Response) => <User>response.json())
                .do(data => this.onRolesUserCountChanged(data.roles));
        }
        else {

            if (userOrUserId.id) {
                return this.deleteUser(userOrUserId.id);
            }
            else {
                return this.endpointFactory.getUserByUserNameEndpoint(userOrUserId.userName)
                    .map((response: Response) => <User>response.json())
                    .mergeMap(user => this.deleteUser(user.id));
            }
        }
    }


    unblockUser(userId: string) {
        return this.endpointFactory.getUnblockUserEndpoint(userId);
    }


    userHasPermission(permissionValue: PermissionValues): boolean {
        return this.permissions.some(p => p == permissionValue);
    }


    refreshLoggedInUser() {
        return this.authService.refreshLogin();
    }




    getRoles(page?: number, pageSize?: number) {

        return this.endpointFactory.getRolesEndpoint(page, pageSize)
            .map((response: Response) => <Role[]>response.json());
    }


    getRolesAndPermissions(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.endpointFactory.getRolesEndpoint(page, pageSize).map((response: Response) => <Role[]>response.json()),
            this.endpointFactory.getPermissionsEndpoint().map((response: Response) => <Permission[]>response.json()));
    }


    updateRole(role: Role) {
        if (role.id) {
            return this.endpointFactory.getUpdateRoleEndpoint(role, role.id)
                .do(data => this.onRolesChanged([role], AccountService.roleModifiedOperation));
        }
        else {
            return this.endpointFactory.getRoleByRoleNameEndpoint(role.name)
                .map((response: Response) => <Role>response.json())
                .mergeMap(foundRole => {
                    role.id = foundRole.id;
                    return this.endpointFactory.getUpdateRoleEndpoint(role, role.id)
                })
                .do(data => this.onRolesChanged([role], AccountService.roleModifiedOperation));
        }
    }


    newRole(role: Role) {
        return this.endpointFactory.getNewRoleEndpoint(role)
            .map((response: Response) => <Role>response.json())
            .do(data => this.onRolesChanged([role], AccountService.roleAddedOperation));
    }


    deleteRole(roleOrRoleId: string | Role): Observable<Role> {

        if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
            return this.endpointFactory.getDeleteRoleEndpoint(<string>roleOrRoleId)
                .map((response: Response) => <Role>response.json())
                .do(data => this.onRolesChanged([data], AccountService.roleDeletedOperation));
        }
        else {

            if (roleOrRoleId.id) {
                return this.deleteRole(roleOrRoleId.id);
            }
            else {
                return this.endpointFactory.getRoleByRoleNameEndpoint(roleOrRoleId.name)
                    .map((response: Response) => <Role>response.json())
                    .mergeMap(role => this.deleteRole(role.id));
            }
        }
    }

    getPermissions() {

        return this.endpointFactory.getPermissionsEndpoint()
            .map((response: Response) => <Permission[]>response.json());
    }


    private onRolesChanged(roles: Role[] | string[], op: RolesChangedOperation) {
        this._rolesChanged.next({ roles: roles, operation: op });
    }


    onRolesUserCountChanged(roles: Role[] | string[]) {
        return this.onRolesChanged(roles, AccountService.roleModifiedOperation);
    }


    getRolesChangedEvent(): Observable<RolesChangedEventArg> {
        return this._rolesChanged.asObservable();
    }



    get permissions(): PermissionValues[] {
        return this.authService.userPermissions;
    }

    get currentUser() {
        return this.authService.currentUser;
    }
}