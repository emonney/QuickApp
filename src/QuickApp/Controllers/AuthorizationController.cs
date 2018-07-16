// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AspNet.Security.OpenIdConnect.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using AspNet.Security.OpenIdConnect.Server;
using OpenIddict.Core;
using AspNet.Security.OpenIdConnect.Primitives;
using DAL.Models;
using DAL.Core;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using OpenIddict.Abstractions;
using OpenIddict.Server;
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

        private const string adminDemoUserEmail = "admin@ebenmonney.com";
        private const string userDemoUserEmail = "user@ebenmonney.com";

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
                    user = await FindUserWithDemoUserEmailAsync(request.Username);


                if (user == null)
                {
                    if (GetIsDemoUser(request.Username))
                    {
                        user = await CreateDemoUserAsync(request.Username);
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


                if (GetIsDemoUser(user))
                {
                    await RefreshDemoUserAsync(user);
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




                // Validate the username/password parameters and ensure the account is not locked out.
                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);

                // Ensure the user is not already locked out.
                if (result.IsLockedOut)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user account has been suspended"
                    });
                }

                // Reject the token request if two-factor authentication has been enabled by the user.
                if (result.RequiresTwoFactor)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid login procedure"
                    });
                }

                // Ensure the user is allowed to sign in.
                if (result.IsNotAllowed)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user is not allowed to sign in"
                    });
                }

                if (!result.Succeeded)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Please check that your email and password is correct"
                    });
                }



                // Create a new authentication ticket.
                var ticket = await CreateTicketAsync(request, user);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await HttpContext.AuthenticateAsync(OpenIddictServerDefaults.AuthenticationScheme);

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
                var ticket = await CreateTicketAsync(request, user);

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
            return GetIsAdminDemoUser(userName) || GetIsUserDemoUser(userName);
        }


        private static bool GetIsDemoUser(ApplicationUser user)
        {
            return GetIsAdminDemoUser(user.UserName) || user.Email.ToLowerInvariant() == adminDemoUserEmail || user.Email.ToLowerInvariant() == userDemoUserEmail;
        }



        private static bool GetIsAdminDemoUser(string userName)
        {
            return userName?.ToLowerInvariant() == "admin";
        }

        private static bool GetIsAdminDemoUser(ApplicationUser user)
        {
            return GetIsAdminDemoUser(user.UserName) || user.Email.ToLowerInvariant() == adminDemoUserEmail;
        }


        private static bool GetIsUserDemoUser(string userName) => userName?.ToLowerInvariant() == "user";





        private async Task<ApplicationUser> FindUserWithDemoUserEmailAsync(string demoUserName)
        {
            if (GetIsAdminDemoUser(demoUserName))
                return await _userManager.FindByEmailAsync(adminDemoUserEmail);

            if (GetIsUserDemoUser(demoUserName))
                return await _userManager.FindByEmailAsync(userDemoUserEmail);

            return null;
        }


        private async Task<ApplicationUser> CreateDemoUserAsync(string userName)
        {
            if (!GetIsDemoUser(userName))
                throw new InvalidOperationException($"The user \"{userName}\" is not a demo user");

            _logger.LogInformation("Recreating demo user: " + userName);


            if (GetIsAdminDemoUser(userName))
            {
                const string adminRoleName = "administrator";
                await _databaseInitializer.EnsureRoleAsync(adminRoleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());

                await _databaseInitializer.CreateUserAsync("admin", "tempP@ss123", "Inbuilt Administrator", adminDemoUserEmail, "+1 (123) 000-0000", new string[] { adminRoleName });
            }
            else
            {
                const string userRoleName = "user";
                await _databaseInitializer.EnsureRoleAsync(userRoleName, "Default user", new string[] { });

                await _databaseInitializer.CreateUserAsync("user", "tempP@ss123", "Inbuilt Standard User", userDemoUserEmail, "+1 (123) 000-0001", new string[] { userRoleName });
            }

            _logger.LogInformation($"Demo user \"{userName}\" recreation completed.");

            return await _userManager.FindByNameAsync(userName);
        }


        private async Task RefreshDemoUserAsync(ApplicationUser user)
        {
            if (!GetIsDemoUser(user))
                throw new InvalidOperationException($"The user \"{user.UserName}\" is not a demo user");


            string roleName = GetIsAdminDemoUser(user) ? "administrator" : "user";
            ApplicationRole role = await _accountManager.GetRoleByNameAsync(roleName);

            if (role == null)
            {
                if (GetIsAdminDemoUser(user))
                    await _databaseInitializer.EnsureRoleAsync(roleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());
                else
                    await _databaseInitializer.EnsureRoleAsync(roleName, "Default user", new string[] { });

                role = await _accountManager.GetRoleByNameAsync(roleName);
            }

            var result = await _accountManager.UpdateRoleAsync(role, GetIsAdminDemoUser(user) ? ApplicationPermissions.GetAllPermissionValues() : new string[] { });
            if (!result.Item1)
                _logger.LogError($"An error occurred whilst refreshing role permissions for demo user \"{user.UserName}\". Error: {result.Item2}");


            user.IsEnabled = true;
            user.Email = GetIsAdminDemoUser(user) ? adminDemoUserEmail : userDemoUserEmail;
            result = await _accountManager.UpdateUserAsync(user, new string[] { roleName });
            if (!result.Item1)
                _logger.LogError($"An error occurred whilst refreshing account details for demo user \"{user.UserName}\". Error: {result.Item2}");

            result = await _accountManager.ResetPasswordAsync(user, "tempP@ss123");
            if (!result.Item1)
                _logger.LogError($"An error occurred whilst refreshing password for demo user \"{user.UserName}\". Error: {result.Item2}");
        }



        private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, ApplicationUser user)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await _signInManager.CreateUserPrincipalAsync(user);

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(principal, new AuthenticationProperties(), OpenIddictServerDefaults.AuthenticationScheme);


            //if (!request.IsRefreshTokenGrantType())
            //{
            // Set the list of scopes granted to the client application.
            // Note: the offline_access scope must be granted
            // to allow OpenIddict to return a refresh token.
            ticket.SetScopes(new[]
            {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Phone,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
            }.Intersect(request.GetScopes()));
            //}

            //ticket.SetResources("quickapp-api");

            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in ticket.Principal.Claims)
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                    continue;


                var destinations = new List<string> { OpenIdConnectConstants.Destinations.AccessToken };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Subject && ticket.HasScope(OpenIdConnectConstants.Scopes.OpenId)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)) ||
                    (claim.Type == CustomClaimTypes.Permission && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }


                claim.SetDestinations(destinations);
            }


            var identity = principal.Identity as ClaimsIdentity;


            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Profile))
            {
                if (!string.IsNullOrWhiteSpace(user.JobTitle))
                    identity.AddClaim(CustomClaimTypes.JobTitle, user.JobTitle, OpenIdConnectConstants.Destinations.IdentityToken);

                if (!string.IsNullOrWhiteSpace(user.FullName))
                    identity.AddClaim(CustomClaimTypes.FullName, user.FullName, OpenIdConnectConstants.Destinations.IdentityToken);

                if (!string.IsNullOrWhiteSpace(user.Configuration))
                    identity.AddClaim(CustomClaimTypes.Configuration, user.Configuration, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Email))
            {
                if (!string.IsNullOrWhiteSpace(user.Email))
                    identity.AddClaim(CustomClaimTypes.Email, user.Email, OpenIdConnectConstants.Destinations.IdentityToken);
            }

            if (ticket.HasScope(OpenIdConnectConstants.Scopes.Phone))
            {
                if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                    identity.AddClaim(CustomClaimTypes.Phone, user.PhoneNumber, OpenIdConnectConstants.Destinations.IdentityToken);
            }


            return ticket;
        }
    }
}
