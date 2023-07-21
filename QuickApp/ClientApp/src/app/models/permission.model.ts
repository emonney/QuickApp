// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

export type PermissionNames =
  'View Users' | 'Manage Users' |
  'View Roles' | 'Manage Roles' | 'Assign Roles';

export type PermissionValues =
  'users.view' | 'users.manage' |
  'roles.view' | 'roles.manage' | 'roles.assign';

export interface Permission {
  name: PermissionNames;
  value: PermissionValues;
  groupName: string;
  description: string;
}

export class Permission {
  public static readonly viewUsers: PermissionValues = 'users.view';
  public static readonly manageUsers: PermissionValues = 'users.manage';

  public static readonly viewRoles: PermissionValues = 'roles.view';
  public static readonly manageRoles: PermissionValues = 'roles.manage';
  public static readonly assignRoles: PermissionValues = 'roles.assign';
}
