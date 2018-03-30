namespace DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;

  public class DefaultTenantRoles
  {
    public static ReadOnlyCollection<ApplicationPermission> Patient =>
        new List<ApplicationPermission>()
        {
          TestDataPermissions.Test_Self_Submit,
          TestDataPermissions.Test_Self_Read,
          OrgStructurePermissions.Org_TenantUpstream_Read
        }.AsReadOnly();

    public static ReadOnlyCollection<ApplicationPermission> Operator =>
        new List<ApplicationPermission>()
        {
          TestDataPermissions.Test_Department_Submit,
          OrgStructurePermissions.Org_TenantUpstream_Read
        }.AsReadOnly();

    public static ReadOnlyCollection<ApplicationPermission> NSS =>
        new List<ApplicationPermission>()
        {
          TestDataPermissions.Test_Department_Read,
          OrgStructurePermissions.Org_TenantUpstream_Read
        }.AsReadOnly();

    /// <summary>
    /// Auditor may be a Dept-, Org-, or Tenant-level role
    /// </summary>
    public static ReadOnlyCollection<ApplicationPermission> TenantAuditor =>
        new List<ApplicationPermission>()
        {
          TestDataPermissions.Test_Tenant_Read,
          OrgStructurePermissions.Org_Tenant_Read
        }.AsReadOnly();

    /// <summary>
    /// Auditor may be a Dept-, Org-, or Tenant-level role
    /// </summary>
    public static ReadOnlyCollection<ApplicationPermission> OrgAuditor =>
        new List<ApplicationPermission>()
        {
          TestDataPermissions.Test_Org_Read,
          OrgStructurePermissions.Org_Tenant_Read
        }.AsReadOnly();

    public static ReadOnlyCollection<ApplicationPermission> PsyPhysiologist =>
        new List<ApplicationPermission>()
        {
          TestDataPermissions.Test_Tenant_Read,
          TestDataPermissions.Test_Tenant_Submit,
          OrgStructurePermissions.Org_Tenant_Read,
          UserPermissions.Users_Tenant_View
        }.AsReadOnly();

    public static ReadOnlyCollection<ApplicationPermission> TenantAdmin =>
        new List<ApplicationPermission>()
        {
          OrgStructurePermissions.Org_Tenant_Read,
          OrgStructurePermissions.Org_Tenant_Manage,
          UserPermissions.Users_Tenant_View,
          UserPermissions.Users_Tenant_Manage
        }.AsReadOnly();

  }
}
