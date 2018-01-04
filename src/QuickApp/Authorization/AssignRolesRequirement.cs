// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using DAL.Core;
using QuickApp.Helpers;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Policies
{
    public class AssignRolesRequirement : IAuthorizationRequirement
    {

    }


    public class AssignRolesHandler : AuthorizationHandler<AssignRolesRequirement, Tuple<string[], string[]>>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AssignRolesRequirement requirement, Tuple<string[], string[]> newAndCurrentRoles)
        {
            if (context.User.HasClaim(CustomClaimTypes.Permission, ApplicationPermissions.AssignRoles) || !GetIsRolesChanged(newAndCurrentRoles.Item1, newAndCurrentRoles.Item2))
                context.Succeed(requirement);

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
    }
}