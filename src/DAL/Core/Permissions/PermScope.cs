using System;
using System.Collections.Generic;
using System.Text;

namespace PskOnline.DAL.Core.Permissions
{
    public static class PermScope
    {
      public const string GLOBAL = nameof(GLOBAL);

      public const string Tenant = nameof(Tenant);

      public const string TenantUpstream = nameof(TenantUpstream);

      public const string Organization = nameof(Organization);

      public const string Department = nameof(Department);

      public const string Self = nameof(Self);
    }
}
