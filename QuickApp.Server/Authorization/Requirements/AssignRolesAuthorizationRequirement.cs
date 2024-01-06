// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Authorization;
using QuickApp.Core.Services.Account;
using System.Security.Claims;

namespace QuickApp.Server.Authorization.Requirements
{
    public class AssignRolesAuthorizationRequirement : IAuthorizationRequirement
    {

    }

    public class AssignRolesAuthorizationHandler :
        AuthorizationHandler<AssignRolesAuthorizationRequirement, (string[] newRoles, string[] currentRoles)>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            AssignRolesAuthorizationRequirement requirement, (string[] newRoles, string[] currentRoles) roles)
        {
            if (!GetIsRolesChanged(roles.newRoles, roles.currentRoles))
            {
                context.Succeed(requirement);
            }
            else if (context.User.HasClaim(CustomClaims.Permission, ApplicationPermissions.AssignRoles))
            {
                // If user has ViewRoles permission, then he can assign any roles
                if (context.User.HasClaim(CustomClaims.Permission, ApplicationPermissions.ViewRoles))
                    context.Succeed(requirement);

                // Else user can only assign roles they're part of
                else if (GetIsUserInAllAddedRoles(context.User, roles.newRoles, roles.currentRoles))
                    context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        private static bool GetIsRolesChanged(string[] newRoles, string[] currentRoles)
        {
            newRoles ??= [];
            currentRoles ??= [];

            var roleAdded = newRoles.Except(currentRoles).Any();
            var roleRemoved = currentRoles.Except(newRoles).Any();

            return roleAdded || roleRemoved;
        }

        private static bool GetIsUserInAllAddedRoles(ClaimsPrincipal contextUser, string[] newRoles, string[] currentRoles)
        {
            newRoles ??= [];
            currentRoles ??= [];

            var addedRoles = newRoles.Except(currentRoles);

            return addedRoles.All(contextUser.IsInRole);
        }
    }
}