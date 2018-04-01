using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using QuickApp.ViewModels;
using AutoMapper;
using DAL.Models;
using DAL.Core.Interfaces;
using QuickApp.Authorization;
using QuickApp.Helpers;
using Microsoft.AspNetCore.JsonPatch;
using DAL.Core.Permissions;

namespace QuickApp.Controllers
{
  [Authorize]
  [Route("api/account")]
  public class AccountController : BaseController
  {
    private readonly IAccountManager _accountManager;
    private readonly IAuthorizationService _authorizationService;
    private const string GetUserByIdActionName = nameof(GetUserById);

    public AccountController(IAccountManager accountManager, IAuthorizationService authorizationService)
    {
      _accountManager = accountManager;
      _authorizationService = authorizationService;
    }

    [HttpGet("users/me")]
    [Produces(typeof(UserViewModel))]
    public async Task<IActionResult> GetCurrentUser()
    {
      return await GetUserByUserName(this.User.Identity.Name);
    }

    [HttpGet("users/{id}", Name = GetUserByIdActionName)]
    [Produces(typeof(UserViewModel))]
    public async Task<IActionResult> GetUserById(string id)
    {
      if( ! (await _authorizationService.AuthorizeAsync(
        this.User, id, AccountManagementOperations.Read)).Succeeded)
      {
        return new ChallengeResult();
      }

      UserViewModel userVM = await GetUserViewModelHelper(id);

      if (userVM != null)
      {
        return Ok(userVM);
      }
      else
      {
        return NotFound(id);
      }
    }

    [HttpGet("users/username/{userName}")]
    [Produces(typeof(UserViewModel))]
    public async Task<IActionResult> GetUserByUserName(string userName)
    {
      ApplicationUser appUser = await _accountManager.GetUserByUserNameAsync(userName);

      if (!(await _authorizationService.AuthorizeAsync(this.User, appUser?.Id ?? "", AccountManagementOperations.Read)).Succeeded)
      {
        return new ChallengeResult();
      }

      if (appUser == null)
      {
        return NotFound(userName);
      }

      return await GetUserById(appUser.Id);
    }

    [HttpGet("users")]
    [Produces(typeof(List<UserViewModel>))]
    [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
    public async Task<IActionResult> GetUsers()
    {
      return await GetUsers(-1, -1);
    }

    [HttpGet("users/{page:int}/{pageSize:int}")]
    [Produces(typeof(List<UserViewModel>))]
    [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
    public async Task<IActionResult> GetUsers(int page, int pageSize)
    {
      var usersAndRoles = await _accountManager.GetUsersAndRolesAsync(page, pageSize);

      List<UserViewModel> usersVM = new List<UserViewModel>();

      foreach (var item in usersAndRoles)
      {
        var userVM = Mapper.Map<UserViewModel>(item.Item1);
        userVM.Roles = item.Item2;

        usersVM.Add(userVM);
      }

      return Ok(usersVM);
    }

    [HttpPut("users/me")]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UserEditViewModel user)
    {
      return await UpdateUser(Utilities.GetUserId(this.User), user);
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UserEditViewModel user)
    {
      ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);
      string[] currentRoles = appUser != null ? (await _accountManager.GetUserRolesAsync(appUser)).ToArray() : null;

      var manageUsersPolicy = _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update);
      var assignRolePolicy = _authorizationService.AuthorizeAsync(this.User, Tuple.Create(user.Roles, currentRoles), Authorization.Policies.AssignAllowedRolesPolicy);


      if ((await Task.WhenAll(manageUsersPolicy, assignRolePolicy)).Any(r => !r.Succeeded))
      {
        return new ChallengeResult();
      }


      if (ModelState.IsValid)
      {
        if (user == null)
        {
          return BadRequest($"{nameof(user)} cannot be null");
        }

        if (!string.IsNullOrWhiteSpace(user.Id) && id != user.Id)
        {
          return BadRequest("Conflicting user id in parameter and model data");
        }

        if (appUser == null)
        {
          return NotFound(id);
        }


        if (Utilities.GetUserId(this.User) == id && string.IsNullOrWhiteSpace(user.CurrentPassword))
        {
          if (!string.IsNullOrWhiteSpace(user.NewPassword))
          {
            return BadRequest("Current password is required when changing your own password");
          }

          if (appUser.UserName != user.UserName)
          {
            return BadRequest("Current password is required when changing your own username");
          }
        }


        bool isValid = true;

        if (Utilities.GetUserId(this.User) == id && (appUser.UserName != user.UserName || !string.IsNullOrWhiteSpace(user.NewPassword)))
        {
          if (!await _accountManager.CheckPasswordAsync(appUser, user.CurrentPassword))
          {
            isValid = false;
            AddErrors(new string[] { "The username/password couple is invalid." });
          }
        }

        if (isValid)
        {
          Mapper.Map<UserViewModel, ApplicationUser>(user, appUser);

          var result = await _accountManager.UpdateUserAsync(appUser, user.Roles);
          if (result.Item1)
          {
            if (!string.IsNullOrWhiteSpace(user.NewPassword))
            {
              if (!string.IsNullOrWhiteSpace(user.CurrentPassword))
              {
                result = await _accountManager.UpdatePasswordAsync(appUser, user.CurrentPassword, user.NewPassword);
              }
              else
              {
                result = await _accountManager.ResetPasswordAsync(appUser, user.NewPassword);
              }
            }

            if (result.Item1)
            {
              return NoContent();
            }
          }

          AddErrors(result.Item2);
        }
      }

      return BadRequest(ModelState);
    }

    [HttpPatch("users/me")]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] JsonPatchDocument<UserPatchViewModel> patch)
    {
      return await UpdateUser(Utilities.GetUserId(this.User), patch);
    }

    [HttpPatch("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] JsonPatchDocument<UserPatchViewModel> patch)
    {
      if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update)).Succeeded)
      {
        return new ChallengeResult();
      }

      if (ModelState.IsValid)
      {
        if (patch == null)
        {
          return BadRequest($"{nameof(patch)} cannot be null");
        }

        ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

        if (appUser == null)
        {
          return NotFound(id);
        }

        UserPatchViewModel userPVM = Mapper.Map<UserPatchViewModel>(appUser);
        patch.ApplyTo(userPVM, ModelState);

        if (ModelState.IsValid)
        {
          Mapper.Map<UserPatchViewModel, ApplicationUser>(userPVM, appUser);

          var result = await _accountManager.UpdateUserAsync(appUser);
          if (result.Item1)
          {
            return NoContent();
          }

          AddErrors(result.Item2);
        }
      }

      return BadRequest(ModelState);
    }

    [HttpPost("users")]
    [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
    public async Task<IActionResult> Register([FromBody] UserEditViewModel user)
    {
      var success = (await _authorizationService.AuthorizeAsync(
        this.User, 
        Tuple.Create(user.Roles, new string[] { }), 
        Authorization.Policies.AssignAllowedRolesPolicy)).Succeeded;

      if (!success)
      {
        return new ChallengeResult();
      }

      if (ModelState.IsValid)
      {
        if (user == null)
        {
          return BadRequest($"{nameof(user)} cannot be null");
        }

        ApplicationUser appUser = Mapper.Map<ApplicationUser>(user);

        var result = await _accountManager.CreateUserAsync(appUser, user.Roles, user.NewPassword);
        if (result.Item1)
        {
          UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);
          return CreatedAtAction(GetUserByIdActionName, new { id = userVM.Id }, userVM);
        }

        AddErrors(result.Item2);
      }

      return BadRequest(ModelState);
    }

    [HttpDelete("users/{id}")]
    [Produces(typeof(UserViewModel))]
    public async Task<IActionResult> DeleteUser(string id)
    {
      if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Delete)).Succeeded)
      {
        return new ChallengeResult();
      }

      if (!await _accountManager.TestCanDeleteUserAsync(id))
      {
        return BadRequest("User cannot be deleted. Delete all orders associated with this user and try again");
      }

      UserViewModel userVM = null;
      ApplicationUser appUser = await this._accountManager.GetUserByIdAsync(id);

      if (appUser != null)
      {
        userVM = await GetUserViewModelHelper(appUser.Id);
      }

      if (userVM == null)
      {
        return NotFound(id);
      }

      var result = await this._accountManager.DeleteUserAsync(appUser);
      if (!result.Item1)
      {
        throw new Exception("The following errors occurred whilst deleting user: " + string.Join(", ", result.Item2));
      }

      return Ok(userVM);
    }

    [HttpPut("users/unblock/{id}")]
    [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
    public async Task<IActionResult> UnblockUser(string id)
    {
      ApplicationUser appUser = await this._accountManager.GetUserByIdAsync(id);

      if (appUser == null)
      {
        return NotFound(id);
      }
      appUser.LockoutEnd = null;
      var result = await _accountManager.UpdateUserAsync(appUser);
      if (!result.Item1)
      {
        throw new Exception("The following errors occurred whilst unblocking user: " + string.Join(", ", result.Item2));
      }

      return NoContent();
    }

    [HttpGet("users/me/preferences")]
    [Produces(typeof(string))]
    public async Task<IActionResult> UserPreferences()
    {
      var userId = Utilities.GetUserId(this.User);
      ApplicationUser appUser = await this._accountManager.GetUserByIdAsync(userId);

      if (appUser != null)
      {
        return Ok(appUser.Configuration);
      }
      else
      {
        return NotFound(userId);
      }
    }

    [HttpPut("users/me/preferences")]
    public async Task<IActionResult> UserPreferences([FromBody] string data)
    {
      var userId = Utilities.GetUserId(this.User);
      ApplicationUser appUser = await this._accountManager.GetUserByIdAsync(userId);

      if (appUser == null)
      {
        return NotFound(userId);
      }

      appUser.Configuration = data;
      var result = await _accountManager.UpdateUserAsync(appUser);
      if (!result.Item1)
      {
        throw new Exception("The following errors occurred whilst updating User Configurations: " + string.Join(", ", result.Item2));
      }

      return NoContent();
    }

    [HttpGet("permissions")]
    [Produces(typeof(List<PermissionViewModel>))]
    [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
    public IActionResult GetAllPermissions()
    {
      return Ok(Mapper.Map<List<PermissionViewModel>>(ApplicationPermissions.AllPermissions));
    }

    private async Task<UserViewModel> GetUserViewModelHelper(string userId)
    {
      var userAndRoles = await _accountManager.GetUserAndRolesAsync(userId);
      if (userAndRoles == null)
      {
        return null;
      }

      var userVM = Mapper.Map<UserViewModel>(userAndRoles.Item1);
      userVM.Roles = userAndRoles.Item2;

      return userVM;
    }

  }
}
