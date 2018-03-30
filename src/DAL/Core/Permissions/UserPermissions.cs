namespace DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;

  /// <summary>
  /// Defines permissions related to User objects
  /// </summary>
  public static class UserPermissions
  {
    public const string UserGroupPrefix = "users";

    public const string UsersPermissionGroupName = "User Permissions";

    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    static UserPermissions()
    {
      AllPermissions = new List<ApplicationPermission>()
      {
        Users_GLOBAL_Manage,
        Users_Tenant_View,
        Users_Tenant_Manage,
      }.AsReadOnly();
    }

    public static ApplicationPermission Users_Tenant_View =>
      new ApplicationPermission("View Tenant Users",
        UserGroupPrefix, PermScope.Tenant, PermAction.Read,
        UsersPermissionGroupName,
        "Permission to view other users account details within own tenant");

    public static ApplicationPermission Users_Tenant_Manage =>
      new ApplicationPermission(
        "Manage Tenant Users", 
        UserGroupPrefix, PermScope.Tenant, PermAction.Manage,
        UsersPermissionGroupName, 
        "Permission to create, delete and modify other users account details within own tenant");

    public static ApplicationPermission Users_GLOBAL_Manage =>
      new ApplicationPermission(
        "Manage GLOBAL Users",
        UserGroupPrefix, PermScope.GLOBAL, PermAction.Manage,
        UsersPermissionGroupName,
        "Permission to create, delete and modify other users account details SITE-WIDE");

    public static ApplicationPermission Users_GLOBAL_View =>
      new ApplicationPermission(
        "View GLOBAL Users",
        UserGroupPrefix, PermScope.GLOBAL, PermAction.Manage,
        UsersPermissionGroupName,
        "Permission to create, delete and modify other users account details SITE-WIDE");

  }
}
