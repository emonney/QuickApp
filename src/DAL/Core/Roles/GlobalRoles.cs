namespace PskOnline.DAL.Core.Roles
{
  using System.Collections.ObjectModel;
  using DAL.Core.Permissions;

  public static class GlobalRoles
  {
    public static ReadOnlyCollection<ApplicationPermission> SiteAdmin
    {
      get
      {
        return ApplicationPermissions.AllPermissions;
      }
    }

  }
}
