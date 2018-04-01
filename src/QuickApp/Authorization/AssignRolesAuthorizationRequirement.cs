using DAL.Core;
using DAL.Core.Permissions;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QuickApp.Authorization
{
  public class AssignRolesAuthorizationRequirement : IAuthorizationRequirement
  {

  }

  public class AssignRolesAuthorizationHandlerUnrestricted :
    AuthorizationHandler<AssignRolesAuthorizationRequirement, Tuple<string[], string[]>>
  {
    protected override Task HandleRequirementAsync(
      AuthorizationHandlerContext context,
      AssignRolesAuthorizationRequirement requirement,
      Tuple<string[], string[]> newAndCurrentRoles)
    {
      context.Succeed(requirement);
      return Task.CompletedTask;
    }
  }

  public class AssignRolesAuthorizationHandler : 
    AuthorizationHandler<AssignRolesAuthorizationRequirement, Tuple<string[], string[]>>
  {
    protected override Task HandleRequirementAsync(
      AuthorizationHandlerContext context, 
      AssignRolesAuthorizationRequirement requirement, 
      Tuple<string[], string[]> newAndCurrentRoles)
    {
      if (!GetIsRolesChanged(newAndCurrentRoles.Item1, newAndCurrentRoles.Item2))
      {
        context.Succeed(requirement);
      }
      else if (context.User.HasClaim(CustomClaimTypes.Permission, RolePermissions.Roles_GLOBAL_Assign))
      {
        if (context.User.HasClaim(CustomClaimTypes.Permission, RolePermissions.Roles_GLOBAL_Assign)) // If user has ViewRoles permission, then he can assign any roles
        {
          context.Succeed(requirement);
        }
      }

      return Task.CompletedTask;
    }


    private bool GetIsRolesChanged(string[] newRoles, string[] currentRoles)
    {
      if (newRoles == null)
        newRoles = new string[] { };

      if (currentRoles == null)
        currentRoles = new string[] { };


      bool roleAdded = newRoles.Except(currentRoles).Any();
      bool roleRemoved = currentRoles.Except(newRoles).Any();

      return roleAdded || roleRemoved;
    }


    private bool GetIsUserInAllAddedRoles(ClaimsPrincipal contextUser, string[] newRoles, string[] currentRoles)
    {
      if (newRoles == null)
        newRoles = new string[] { };

      if (currentRoles == null)
        currentRoles = new string[] { };


      var addedRoles = newRoles.Except(currentRoles);

      return addedRoles.All(role => contextUser.IsInRole(role));
    }
  }
}