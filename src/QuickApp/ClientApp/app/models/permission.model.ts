// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

export type PermissionNames =
    "View GLOBAL Users" | "Manage GLOBAL Users" |
    "View GLOBAL Roles" | "Manage GLOBAL Roles" | "Assign GLOBAL Roles" |
    "View Customers" | "Manage Customers";

export type PermissionValues =
    "users.GLOBAL.View" | "users.GLOBAL.Manage" |
    "roles.GLOBAL.View" | "roles.GLOBAL.Manage" | "roles.GLOBAL.AssignRole" |
    "customers.GLOBAL.View" | "customers.GLOBAL.Manage";

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = "users.GLOBAL.View";
    public static readonly manageUsersPermission: PermissionValues = "users.GLOBAL.Manage";
    public static readonly viewCustomersPermission: PermissionValues = "customers.GLOBAL.View";
    public static readonly manageCustomersPermission: PermissionValues = "customers.GLOBAL.Manage";

    public static readonly viewRolesPermission: PermissionValues = "roles.GLOBAL.View";
    public static readonly assignRolesPermission: PermissionValues = "roles.GLOBAL.AssignRole";
    public static readonly manageRolesPermission: PermissionValues = "roles.GLOBAL.Manage";


    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}