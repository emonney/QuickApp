// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using QuickApp.Core.Models.Account;
using QuickApp.Core.Services.Account;
using System.Security.Claims;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace QuickApp.Server.Controllers
{
    public class AuthorizationController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthorizationController(SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("~/connect/token")]
        [Produces("application/json")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> Exchange()
        {
            var request = HttpContext.GetOpenIddictServerRequest()
                ?? throw new InvalidOperationException("The OpenID Connect request cannot be retrieved.");

            if (request.IsPasswordGrantType())
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                    return GetForbidResult("Username or password cannot be empty.");

                var user = await _userManager.FindByNameAsync(request.Username)
                    ?? await _userManager.FindByEmailAsync(request.Username);

                if (user == null)
                    return GetForbidResult("Please check that your username and password is correct.");

                if (!user.IsEnabled)
                    return GetForbidResult("The specified user account is disabled.");

                var result =
                    await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

                if (result.IsLockedOut)
                    return GetForbidResult("The specified user account has been suspended.");

                if (result.IsNotAllowed)
                    return GetForbidResult("The specified user is not allowed to sign in.");

                if (!result.Succeeded)
                    return GetForbidResult("Please check that your username and password is correct.");

                var principal = await CreateClaimsPrincipalAsync(user, request.GetScopes());

                return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
                var result =
                    await HttpContext.AuthenticateAsync(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

                var userId = result?.Principal?.GetClaim(Claims.Subject);
                var user = userId != null ? await _userManager.FindByIdAsync(userId) : null;

                if (user == null)
                    return GetForbidResult("The refresh token is no longer valid.");

                if (!user.IsEnabled)
                    return GetForbidResult("The specified user account is disabled.");

                if (!await _signInManager.CanSignInAsync(user))
                    return GetForbidResult("The user is no longer allowed to sign in.");

                var scopes = request.GetScopes();
                if (scopes.Length == 0 && result?.Principal != null)
                    scopes = result.Principal.GetScopes();

                // Recreate the claims principal in case they changed since the refresh token was issued.
                var principal = await CreateClaimsPrincipalAsync(user, scopes);

                return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }

            throw new InvalidOperationException($"The specified grant type \"{request.GrantType}\" is not supported.");
        }

        private ForbidResult GetForbidResult(string errorDescription, string error = Errors.InvalidGrant)
        {
            var properties = new AuthenticationProperties(new Dictionary<string, string?>
            {
                [OpenIddictServerAspNetCoreConstants.Properties.Error] = error,
                [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = errorDescription
            });

            return Forbid(properties, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        private async Task<ClaimsPrincipal> CreateClaimsPrincipalAsync(ApplicationUser user, IEnumerable<string> scopes)
        {
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            principal.SetScopes(scopes);

            var identity = principal.Identity as ClaimsIdentity
                ?? throw new InvalidOperationException("The ClaimsPrincipal's Identity is null.");

            if (user.JobTitle != null) identity.SetClaim(CustomClaims.JobTitle, user.JobTitle);
            if (user.FullName != null) identity.SetClaim(CustomClaims.FullName, user.FullName);
            if (user.Configuration != null) identity.SetClaim(CustomClaims.Configuration, user.Configuration);

            principal.SetDestinations(GetDestinations);

            return principal;
        }

        private static IEnumerable<string> GetDestinations(Claim claim)
        {
            if (claim.Subject == null)
                throw new InvalidOperationException("The Claim's Subject is null.");

            switch (claim.Type)
            {
                case Claims.Name:
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case Claims.Email:
                    if (claim.Subject.HasScope(Scopes.Email))
                        yield return Destinations.IdentityToken;

                    yield break;

                case CustomClaims.JobTitle:
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case CustomClaims.FullName:
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case CustomClaims.Configuration:
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case Claims.Role:
                    yield return Destinations.AccessToken;

                    if (claim.Subject.HasScope(Scopes.Roles))
                        yield return Destinations.IdentityToken;

                    yield break;

                case CustomClaims.Permission:
                    yield return Destinations.AccessToken;

                    if (claim.Subject.HasScope(Scopes.Roles))
                        yield return Destinations.IdentityToken;

                    yield break;

                // IdentityOptions.ClaimsIdentity.SecurityStampClaimType
                case "AspNet.Identity.SecurityStamp":
                    // Never include the security stamp in the access and identity tokens, as it's a secret value.
                    yield break;

                default:
                    yield return Destinations.AccessToken;
                    yield break;
            }
        }
    }
}
