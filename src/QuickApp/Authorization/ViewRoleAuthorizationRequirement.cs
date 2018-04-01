using PskOnline.DAL.Core;
using PskOnline.DAL.Core.Permissions;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PskOnline.Service.Authorization
{
  public class ViewRoleAuthorizationRequirement : IAuthorizationRequirement
  {

  }

  public class ViewRoleAuthorizationHandlerUnrestricted : AuthorizationHandler<ViewRoleAuthorizationRequirement, string>
  {
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ViewRoleAuthorizationRequirement requirement, string roleName)
    {
      context.Succeed(requirement);
      return Task.CompletedTask;
    }
  }

  public class ViewRoleAuthorizationHandler : AuthorizationHandler<ViewRoleAuthorizationRequirement, string>
  {
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ViewRoleAuthorizationRequirement requirement, string roleName)
    {
      if (context.User == null)
      {
        return Task.CompletedTask;
      }
      if (context.User.HasClaim(CustomClaimTypes.Permission, RolePermissions.Roles_GLOBAL_View) ||
          context.User.IsInRole(roleName))
      {
        context.Succeed(requirement);
      }
      return Task.CompletedTask;
    }
  }
}
