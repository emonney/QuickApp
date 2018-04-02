namespace PskOnline.DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;
  using System.Linq;

  public static class ApplicationPermissions
  {
    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    static ApplicationPermissions()
    {
      var allAppPerm = new List<ApplicationPermission>();

      allAppPerm.AddRange(OrgStructurePermissions.AllPermissions);
      allAppPerm.AddRange(TestDataPermissions.AllPermissions);
      allAppPerm.AddRange(UserPermissions.AllPermissions);
      allAppPerm.AddRange(RolePermissions.AllPermissions);
      allAppPerm.AddRange(CustomerPermissions.AllPermissions);

      AllPermissions = allAppPerm.AsReadOnly();
    }

    public static string[] GetAdministrativePermissionValues()
    {
      return new string[] {
        UserPermissions.Users_GLOBAL_Manage,
        UserPermissions.Users_GLOBAL_View,
        RolePermissions.Roles_GLOBAL_Manage,
        RolePermissions.Roles_GLOBAL_Assign,
        RolePermissions.Roles_GLOBAL_View,
        CustomerPermissions.Customers_GLOBAL_Manage,
        CustomerPermissions.Customers_GLOBAL_View
      };
    }

    public static ApplicationPermission GetPermissionByName(string permissionName)
    {
      return AllPermissions.Where(p => p.Name == permissionName).FirstOrDefault();
    }

    public static ApplicationPermission GetPermissionByValue(string permissionValue)
    {
      return AllPermissions.Where(p => p.Value == permissionValue).FirstOrDefault();
    }

    public static ICollection<ApplicationPermission> GetPermissionsByType(string type)
    {
      return AllPermissions.Where(p => p.Type == type).ToList();
    }

    public static ICollection<ApplicationPermission> GetPermissionsByScope(string scope)
    {
      return AllPermissions.Where(p => p.Scope == scope).ToList();
    }

    public static ICollection<ApplicationPermission> GetPermissionsByAction(string action)
    {
      return AllPermissions.Where(p => p.Action == action).ToList();
    }

    public static string[] GetAllPermissionValues()
    {
      return AllPermissions.Select(p => p.Value).ToArray();
    }

  }
}
