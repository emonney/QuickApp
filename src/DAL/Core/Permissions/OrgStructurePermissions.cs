using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Core.Permissions
{
  /// <summary>
  /// defines permissions to submit / view test data
  /// </summary>
  class OrgStructurePermissions
  {
    public const string OrgStructurePermissionsGroupName = "Org Structure Permissions";
    public const string GrouPrefix = "org";

    public static ApplicationPermission OrgManage_Tenant =>
        new ApplicationPermission(
            "Manage org structure",
            GrouPrefix + ".manage.tenant",
            OrgStructurePermissionsGroupName,
            "Permission to submit one's own test data");

    public static ApplicationPermission OrgRead_Upstream =>
        new ApplicationPermission(
            "View upstream org structure",
            GrouPrefix + ".read.upstream",
            OrgStructurePermissionsGroupName,
            "Permission to read upstream org structure");

    public static ApplicationPermission OrgRead_Tenant =>
        new ApplicationPermission(
            "View tenant org structure",
            GrouPrefix + ".read.tenant",
            OrgStructurePermissionsGroupName,
            "Permission to read tenant org structure");

  }
}
