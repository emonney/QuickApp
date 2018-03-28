// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;

namespace DAL.Core.Permissions
{
  public static class ApplicationPermissions
  {
    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    public const string UsersPermissionGroupName = "User Permissions";

    public static ApplicationPermission ViewUsers =>
      new ApplicationPermission("View Users", "users.view", UsersPermissionGroupName, 
        "Permission to view other users account details");

    public static ApplicationPermission ManageUsers =>
      new ApplicationPermission("Manage Users", "users.manage", UsersPermissionGroupName, "Permission to create, delete and modify other users account details");

    public const string RolesPermissionGroupName = "Role Permissions";

    public static ApplicationPermission ViewRoles =>
      new ApplicationPermission(
        "View Tenant Roles", 
        "roles.local.view", 
        RolesPermissionGroupName, 
        "Permission to view available roles for tenant users");

    public static ApplicationPermission AssignRoles =>
      new ApplicationPermission(
        "Assign Tenant Roles",
        "roles.local.assign",
        RolesPermissionGroupName,
        "Permission to assign roles to users managed by the tenant");

    public static ApplicationPermission ManageRoles =>
      new ApplicationPermission(
        "Manage Roles",
        "roles.global.manage",
        RolesPermissionGroupName,
        "Permission to create, delete and modify ALL roles.");


    static ApplicationPermissions()
    {
      List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
      {
          ViewUsers,
          ManageUsers,

          ViewRoles,
          ManageRoles,
          AssignRoles,

      };

      allPermissions.AddRange(TestDataPermissions.allPermissions);

      AllPermissions = allPermissions.AsReadOnly();
    }

    public static ApplicationPermission GetPermissionByName(string permissionName)
    {
      return AllPermissions.Where(p => p.Name == permissionName).FirstOrDefault();
    }

    public static ApplicationPermission GetPermissionByValue(string permissionValue)
    {
      return AllPermissions.Where(p => p.Value == permissionValue).FirstOrDefault();
    }

    public static string[] GetAllPermissionValues()
    {
      return AllPermissions.Select(p => p.Value).ToArray();
    }

    public static string[] GetAdministrativePermissionValues()
    {
      return new string[] { ManageUsers, ManageRoles, AssignRoles };
    }
  }
}
