namespace DAL.Core.Permissions
{
  using System.Collections.ObjectModel;

  public static class DefaultGlobalRoles
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
