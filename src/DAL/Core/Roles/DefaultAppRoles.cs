namespace PskOnline.DAL.Core.Roles
{
  using DAL.Core.Permissions;
  using System.Collections.Generic;

  public static class ApplicationRoles
  {
    public static RoleDefinition GetBuiltInAdminRoleDefinition()
    {
      return new RoleDefinition(
              "Site Admin",
              "Default Site Administrator",
              ApplicationPermissions.AllPermissions);
    }

    public static IReadOnlyCollection<RoleDefinition> GetAllRoles()
    {
      var roles = new List<RoleDefinition>
          {
            GetBuiltInAdminRoleDefinition(),

            new RoleDefinition(
              "Patient",
              "Patient",
              new [] { TestDataPermissions.Test_Self_Submit,
                       OrgStructurePermissions.Org_TenantUpstream_View }),

            new RoleDefinition(
              "Company Auditor",
              "Company-wide auditor (General Manager or Principal Engineer)",
              new [] { TestDataPermissions.Test_Tenant_View,
                       OrgStructurePermissions.Org_Tenant_View,
                       UserPermissions.Users_Tenant_View }),

            new RoleDefinition(
              "Psychophysiologist",
              "Psychophysiologist",
              new [] { TestDataPermissions.Test_Tenant_View,
                       TestDataPermissions.Test_Tenant_Submit,
                       OrgStructurePermissions.Org_Tenant_View,
                       UserPermissions.Users_Tenant_View }),

            new RoleDefinition(
              "Tenant Administrator",
              "Tenant Administrator (structure & users)",
              new [] { OrgStructurePermissions.Org_Tenant_View,
                       OrgStructurePermissions.Org_Tenant_Manage,
                       RolePermissions.Roles_Tenant_Assign,
                       RolePermissions.Roles_Tenant_View,
                       UserPermissions.Users_Tenant_Manage,
                       UserPermissions.Users_Tenant_View }),

          };
      return roles;
    }
  }
}
