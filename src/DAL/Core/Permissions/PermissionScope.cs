using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Core.Permissions
{
    public static class PermissionScope
    {
      public const string Global = "global";
      public const string Tenant = "tenant";
      public const string TenantUpstream = "tenantupstream";
      public const string Department = "department";
      public const string Self = "self";
    }
}
