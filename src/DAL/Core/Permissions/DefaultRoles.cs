using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Core.Permissions
{
  using System.Collections.ObjectModel;


  public class DefaultRoles
  {
    public static ReadOnlyCollection<ApplicationPermission> Patient
    {
      get
      {
        return new List<ApplicationPermission>()
        {
          TestDataPermissions.TestSubmit_Self,
          TestDataPermissions.TestRead_Self,
          OrgStructurePermissions.OrgRead_Upstream
        }.AsReadOnly();
      }
    }

    public static ReadOnlyCollection<ApplicationPermission> Operator
    {
      get
      {
        return new List<ApplicationPermission>()
        {
          TestDataPermissions.TestSubmit_Department,
          OrgStructurePermissions.OrgRead_Upstream
        }.AsReadOnly();
      }
    }

    public static ReadOnlyCollection<ApplicationPermission> NSS
    {
      get
      {
        return new List<ApplicationPermission>()
        {
          TestDataPermissions.TestRead_Department,
          OrgStructurePermissions.OrgRead_Upstream
        }.AsReadOnly();
      }
    }

    public static ReadOnlyCollection<ApplicationPermission> Auditor
    {
      get
      {
        return new List<ApplicationPermission>()
        {
          TestDataPermissions.TestRead_Department,
          OrgStructurePermissions.OrgRead_Tenant
        }.AsReadOnly();
      }
    }

    public static ReadOnlyCollection<ApplicationPermission> PsyPhysiologist
    {
      get
      {
        throw new NotImplementedException();
      }
    }

    public static ReadOnlyCollection<ApplicationPermission> TenantAdmin
    {
      get
      {
        throw new NotImplementedException();
      }
    }

    public static ReadOnlyCollection<ApplicationPermission> SiteAdmin
    {
      get
      {
        throw new NotImplementedException();
      }
    }



  }
}
