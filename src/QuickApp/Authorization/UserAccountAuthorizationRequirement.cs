using PskOnline.DAL.Core;
using PskOnline.DAL.Core.Permissions;
using Microsoft.AspNetCore.Authorization;
using PskOnline.Service.Helpers;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PskOnline.Service.Authorization
{
  public class UserAccountAuthorizationRequirement : IAuthorizationRequirement
  {
    public UserAccountAuthorizationRequirement(string operationName)
    {
      this.OperationName = operationName;
    }

    public string OperationName { get; private set; }
  }

  public class ViewUserAuthorizationHandlerUnrestricted : AuthorizationHandler<UserAccountAuthorizationRequirement, string>
  {
    protected override Task HandleRequirementAsync(
      AuthorizationHandlerContext context,
      UserAccountAuthorizationRequirement requirement,
      string targetUserId)
    {
      context.Succeed(requirement);
      return Task.CompletedTask;
    }
  }

  public class ViewUserAuthorizationHandler : AuthorizationHandler<UserAccountAuthorizationRequirement, string>
  {
    protected override Task HandleRequirementAsync(
      AuthorizationHandlerContext context,
      UserAccountAuthorizationRequirement requirement,
      string targetUserId)
    {
      if (context.User == null || requirement.OperationName != 
          AccountManagementOperations.ReadOperationName)
      {
        return Task.CompletedTask;
      }

      if (context.User.HasClaim(CustomClaimTypes.Permission, UserPermissions.Users_GLOBAL_View) ||
          GetIsSameUser(context.User, targetUserId))
      {
        context.Succeed(requirement);
      }

      return Task.CompletedTask;
    }


    private bool GetIsSameUser(ClaimsPrincipal user, string targetUserId)
    {
      if (string.IsNullOrWhiteSpace(targetUserId))
      {
        return false;
      }

      return Utilities.GetUserId(user) == targetUserId;
    }
  }

  public class ManageUserAuthorizationHandlerUnrestricted : AuthorizationHandler<UserAccountAuthorizationRequirement, string>
  {
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserAccountAuthorizationRequirement requirement, string targetUserId)
    {
      context.Succeed(requirement);
      return Task.CompletedTask;
    }
  }

  public class ManageUserAuthorizationHandler : AuthorizationHandler<UserAccountAuthorizationRequirement, string>
  {
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserAccountAuthorizationRequirement requirement, string targetUserId)
    {
      if (context.User == null ||
          (requirement.OperationName != AccountManagementOperations.CreateOperationName &&
           requirement.OperationName != AccountManagementOperations.UpdateOperationName &&
           requirement.OperationName != AccountManagementOperations.DeleteOperationName))
      {
        return Task.CompletedTask;
      }

      var canManageGlobalUsers = context.User.HasClaim(
        CustomClaimTypes.Permission,
        UserPermissions.Users_GLOBAL_Manage);

      if (canManageGlobalUsers || GetIsSameUser(context.User, targetUserId))
      {
        context.Succeed(requirement);
      }

      return Task.CompletedTask;
    }

    private bool GetIsSameUser(ClaimsPrincipal user, string targetUserId)
    {
      if (string.IsNullOrWhiteSpace(targetUserId))
      {
        return false;
      }

      return Utilities.GetUserId(user) == targetUserId;
    }
  }
}