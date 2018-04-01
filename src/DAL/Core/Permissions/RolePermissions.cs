namespace PskOnline.DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;

  /// <summary>
  /// Defines permissions related to operation on user roles
  /// </summary>
  public class RolePermissions
  {
    public const string RolePermissionsGroupName = "Role Permissions";
    public const string RolePermGroup = "roles";

    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    static RolePermissions()
    {
      AllPermissions = new List<ApplicationPermission>()
        {
          Roles_GLOBAL_View,
          Roles_GLOBAL_Assign,
          Roles_GLOBAL_Manage,
          Roles_Tenant_Assign,
          Roles_Tenant_View
        }.AsReadOnly();
    }

    public static ApplicationPermission Roles_Tenant_View =>
      new ApplicationPermission(
        "View Tenant Roles",
        RolePermGroup, PermScope.Tenant, PermAction.View,
        RolePermissionsGroupName,
        "Permission to view available roles for tenant users");

    public static ApplicationPermission Roles_Tenant_Assign =>
      new ApplicationPermission(
        "Assign Tenant Roles",
        RolePermGroup, PermScope.Tenant, PermAction.AssignRole,
        RolePermissionsGroupName,
        "Permission to assign roles to users within own tenant");

    public static ApplicationPermission Roles_GLOBAL_View =>
      new ApplicationPermission(
        "View GLOBAL Roles",
        RolePermGroup, PermScope.GLOBAL, PermAction.View,
        RolePermissionsGroupName,
        "Permission to view available roles for GLOBAL users (site-level)");

    public static ApplicationPermission Roles_GLOBAL_Assign =>
      new ApplicationPermission(
        "Assign GLOBAL Roles",
        RolePermGroup, PermScope.GLOBAL, PermAction.AssignRole,
        RolePermissionsGroupName,
        "Permission to assign roles to GLOBAL users (site-level)");

    public static ApplicationPermission Roles_GLOBAL_Manage =>
      new ApplicationPermission(
        "Manage GLOBAL Roles",
        RolePermGroup, PermScope.GLOBAL, PermAction.Manage,
        RolePermissionsGroupName,
        "Permission to create, delete and modify GLOBAL roles.");
  }
}
