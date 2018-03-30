namespace DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;

  /// <summary>
  /// defines permissions to view / manage organizational structure
  /// </summary>
  class OrgStructurePermissions
  {
    public const string OrgStructurePermissionsGroupName = "Org Structure Permissions";

    public const string OrgGroupPrefix = "org_struct";

    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    static OrgStructurePermissions()
    {
      AllPermissions = new List<ApplicationPermission>
      {
        Org_TenantUpstream_Read,
        Org_Tenant_Manage,
        Org_Tenant_Read
      }.AsReadOnly();
    }

    public static ApplicationPermission Org_TenantUpstream_Read =>
        new ApplicationPermission(
            "View upstream org structure",
            OrgGroupPrefix, PermScope.TenantUpstream, PermAction.Read,
            OrgStructurePermissionsGroupName,
            "Permission to read upstream org structure within own tenant");

    public static ApplicationPermission Org_Tenant_Read =>
        new ApplicationPermission(
            "View entire tenant org structure",
            OrgGroupPrefix, PermScope.Tenant, PermAction.Read,
            OrgStructurePermissionsGroupName,
            "Permission to read org structure within own tenant");

    public static ApplicationPermission Org_Tenant_Manage =>
        new ApplicationPermission(
            "Manage entire tenant org structure",
            OrgGroupPrefix, PermScope.Tenant, PermAction.Manage,
            OrgStructurePermissionsGroupName,
            "Permission to manage org structure within own tenant");
  }
}
