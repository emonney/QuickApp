// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AspNet.Security.OpenIdConnect.Extensions;
using OpenIddict;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Authentication;
using AspNet.Security.OpenIdConnect.Server;
using OpenIddict.Models;
using OpenIddict.Core;
using AspNet.Security.OpenIdConnect.Primitives;
using DAL.Models;
using DAL.Core;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Builder;
using DAL;
using Microsoft.Extensions.Logging;
using DAL.Core.Interfaces;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860


namespace QuickApp.Controllers
{
    public class AuthorizationController : Controller
    {
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAccountManager _accountManager;
        private readonly IDatabaseInitializer _databaseInitializer;
        private readonly ILogger _logger;


        public AuthorizationController(
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IAccountManager accountManager,
            IDatabaseInitializer databaseInitializer,
            ILogger<AuthorizationController> logger)
        {
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _userManager = userManager;
            _accountManager = accountManager;
            _databaseInitializer = databaseInitializer;
            _logger = logger;
        }


        [HttpPost("~/connect/token")]
        [Produces("application/json")]
        public async Task<IActionResult> Exchange(OpenIdConnectRequest request)
        {
            if (request.IsPasswordGrantType())
            {
                var user = await _userManager.FindByEmailAsync(request.Username) ?? await _userManager.FindByNameAsync(request.Username);
                if (user == null)
                {
                    if (GetIsDemoUser(request.Username))
                    {
                        user = await CreateDemoUser(request.Username);
                    }
                    else
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "Please check that your email and password is correct"
                        });
                    }
                }

                if (GetIsDemoUser(user.UserName))
                {
                    await RefreshDemoUser(user);
                }
                else
                {
                    // Ensure the user is allowed to sign in.
                    if (!await _signInManager.CanSignInAsync(user))
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "The specified user is not allowed to sign in"
                        });
                    }

                    // Reject the token request if two-factor authentication has been enabled by the user.
                    if (_userManager.SupportsUserTwoFactor && await _userManager.GetTwoFactorEnabledAsync(user))
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "The specified user is not allowed to sign in"
                        });
                    }

                    // Ensure the user is not already locked out.
                    if (_userManager.SupportsUserLockout && await _userManager.IsLockedOutAsync(user))
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "The specified user account has been suspended"
                        });
                    }

                    // Ensure the user is enabled.
                    if (!user.IsEnabled)
                    {
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "The specified user account is disabled"
                        });
                    }
                }


                // Ensure the password is valid.
                if (!await _userManager.CheckPasswordAsync(user, request.Password))
                {
                    if (_userManager.SupportsUserLockout)
                    {
                        await _userManager.AccessFailedAsync(user);
                    }

                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Please check that your email and password is correct"
                    });
                }

                if (_userManager.SupportsUserLockout)
                {
                    await _userManager.ResetAccessFailedCountAsync(user);
                }

                // Create a new authentication ticket.
                var ticket = await CreateTicketAsync(request, user);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await HttpContext.Authentication.GetAuthenticateInfoAsync(
                    OpenIdConnectServerDefaults.AuthenticationScheme);

                // Retrieve the user profile corresponding to the refresh token.
                // Note: if you want to automatically invalidate the refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await _userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The refresh token is no longer valid"
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await _signInManager.CanSignInAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in"
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored
                // in the refresh token, including the scopes originally granted.
                var ticket = await CreateTicketAsync(request, user, info.Properties);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            return BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported"
            });
        }



        private static bool GetIsDemoUser(string userName)
        {
            string loweredUserName = userName?.ToLowerInvariant();
            return loweredUserName == "admin" || loweredUserName == "user";
        }


        private static bool GetIsAdminDemoUser(string userName) => userName?.ToLowerInvariant() == "admin";


        private static bool GetIsUserDemoUser(string userName) => userName?.ToLowerInvariant() == "user";


        private async Task<ApplicationUser> CreateDemoUser(string userName)
        {
            if (!GetIsDemoUser(userName))
                throw new InvalidOperationException($"The user \"{userName}\" is not a demo user");

            _logger.LogInformation("Recreating demo user: " + userName);


            if (GetIsAdminDemoUser(userName))
            {
                const string adminRoleName = "administrator";
                await _databaseInitializer.ensureRoleAsync(adminRoleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());

                await _databaseInitializer.createUserAsync("admin", "tempP@ss123", "Inbuilt Administrator", "admin@ebenmonney.com", "+1 (123) 000-0000", new string[] { adminRoleName });
            }
            else
            {
                const string userRoleName = "user";
                await _databaseInitializer.ensureRoleAsync(userRoleName, "Default user", new string[] { });

                await _databaseInitializer.createUserAsync("user", "tempP@ss123", "Inbuilt Standard User", "user@ebenmonney.com", "+1 (123) 000-0001", new string[] { userRoleName });
            }

            _logger.LogInformation($"Demo user \"{userName}\" recreation completed.");

            return await _userManager.FindByNameAsync(userName);
        }


        private async Task RefreshDemoUser(ApplicationUser user)
        {
            if (!GetIsDemoUser(user.UserName))
                throw new InvalidOperationException($"The user \"{user.UserName}\" is not a demo user");


            string roleName = GetIsAdminDemoUser(user.UserName) ? "administrator" : "user";
            ApplicationRole role = await _accountManager.GetRoleByNameAsync(roleName);

            if (role == null)
            {
                if (GetIsAdminDemoUser(user.UserName))
                    await _databaseInitializer.ensureRoleAsync(roleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());
                else
                    await _databaseInitializer.ensureRoleAsync(roleName, "Default user", new string[] { });

                role = await _accountManager.GetRoleByNameAsync(roleName);
            }

            var result = await _accountManager.UpdateRoleAsync(role, GetIsAdminDemoUser(user.UserName) ? ApplicationPermissions.GetAllPermissionValues() : new string[] { });
            if (!result.Item1)
                _logger.LogError($"An error occurred whilst refreshing role permissions for demo user \"{user.UserName}\". Error: {result.Item2}");


            user.Email = GetIsAdminDemoUser(user.UserName) ? "admin@ebenmonney.com" : "user@ebenmonney.com";
            result = await _accountManager.UpdateUserAsync(user, new string[] { roleName });
            if (!result.Item1)
                _logger.LogError($"An error occurred whilst refreshing account details for demo user \"{user.UserName}\". Error: {result.Item2}");

            result = await _accountManager.ResetPasswordAsync(user, "tempP@ss123");
            if (!result.Item1)
                _logger.LogError($"An error occurred whilst refreshing password for demo user \"{user.UserName}\". Error: {result.Item2}");
        }



        private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, ApplicationUser user, AuthenticationProperties properties = null)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await _signInManager.CreateUserPrincipalAsync(user);

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(principal, new AuthenticationProperties(), OpenIdConnectServerDefaults.AuthenticationScheme);
            ticket.SetResources(request.GetResources());

            //if (!request.IsRefreshTokenGrantType())
            //{
            // Set the list of scopes granted to the client application.
            // Note: the offline_access scope must be granted
            // to allow OpenIddict to return a refresh token.
            ticket.SetScopes(new[]
            {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));
            //}


            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in ticket.Principal.Claims)
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                    continue;

                claim.SetDestinations(OpenIdConnectConstants.Destinations.AccessToken, OpenIdConnectConstants.Destinations.IdentityToken);
            }


            var identity = principal.Identity as ClaimsIdentity;

            if (!string.IsNullOrWhiteSpace(user.Email))
                identity.AddClaim(CustomClaimTypes.Email, user.Email, OpenIdConnectConstants.Destinations.IdentityToken);

            if (!string.IsNullOrWhiteSpace(user.FullName))
                identity.AddClaim(CustomClaimTypes.FullName, user.FullName, OpenIdConnectConstants.Destinations.IdentityToken);

            if (!string.IsNullOrWhiteSpace(user.JobTitle))
                identity.AddClaim(CustomClaimTypes.JobTitle, user.JobTitle, OpenIdConnectConstants.Destinations.IdentityToken);

            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                identity.AddClaim(CustomClaimTypes.Phone, user.PhoneNumber, OpenIdConnectConstants.Destinations.IdentityToken);

            if (!string.IsNullOrWhiteSpace(user.Configuration))
                identity.AddClaim(CustomClaimTypes.Configuration, user.Configuration, OpenIdConnectConstants.Destinations.IdentityToken);


            return ticket;
        }
    }
}
