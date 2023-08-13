// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using DAL.Core;
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

    public class AssignRolesAuthorizationHandler : AuthorizationHandler<AssignRolesAuthorizationRequirement, (string[] newRoles, string[] currentRoles)>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AssignRolesAuthorizationRequirement requirement, (string[] newRoles, string[] currentRoles) roles)
        {
            if (!GetIsRolesChanged(roles.newRoles, roles.currentRoles))
            {
                context.Succeed(requirement);
            }
            else if (context.User.HasClaim(ClaimConstants.Permission, ApplicationPermissions.AssignRoles))
            {
                if (context.User.HasClaim(ClaimConstants.Permission, ApplicationPermissions.ViewRoles)) // If user has ViewRoles permission, then he can assign any roles
                    context.Succeed(requirement);

                else if (GetIsUserInAllAddedRoles(context.User, roles.newRoles, roles.currentRoles)) // Else user can only assign roles they're part of
                    context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        private bool GetIsRolesChanged(string[] newRoles, string[] currentRoles)
        {
            newRoles ??= new string[] { };

            currentRoles ??= new string[] { };

            var roleAdded = newRoles.Except(currentRoles).Any();
            var roleRemoved = currentRoles.Except(newRoles).Any();

            return roleAdded || roleRemoved;
        }

        private bool GetIsUserInAllAddedRoles(ClaimsPrincipal contextUser, string[] newRoles, string[] currentRoles)
        {
            newRoles ??= new string[] { };

            currentRoles ??= new string[] { };

            var addedRoles = newRoles.Except(currentRoles);

            return addedRoles.All(contextUser.IsInRole);
        }
    }
}