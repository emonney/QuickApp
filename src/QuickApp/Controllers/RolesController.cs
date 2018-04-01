namespace QuickApp.Controllers
{
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

  [Authorize]
  [Route("api/[controller]")]
  public class RolesController : BaseController
  {
    private readonly IAccountManager _accountManager;
    private readonly IAuthorizationService _authorizationService;

    private const string GetRoleByIdActionName = nameof(GetRoleById);

    public RolesController(IAccountManager accountManager, IAuthorizationService authorizationService)
    {
      _accountManager = accountManager;
      _authorizationService = authorizationService;
    }


    private async Task<RoleViewModel> GetRoleViewModelHelper(string roleName)
    {
      var role = await _accountManager.GetRoleLoadRelatedAsync(roleName);
      if (role != null)
      {
        return Mapper.Map<RoleViewModel>(role);
      }

      return null;
    }

    [HttpGet("roles/{id}", Name = GetRoleByIdActionName)]
    [Produces(typeof(RoleViewModel))]
    public async Task<IActionResult> GetRoleById(string id)
    {
      var appRole = await _accountManager.GetRoleByIdAsync(id);

      if (!(await _authorizationService.AuthorizeAsync(this.User, appRole?.Name ?? "", Authorization.Policies.ViewRoleByRoleNamePolicy)).Succeeded)
      {
        return new ChallengeResult();
      }

      if (appRole == null)
      {
        return NotFound(id);
      }

      return await GetRoleByName(appRole.Name);
    }

    [HttpGet("roles/name/{name}")]
    [Produces(typeof(RoleViewModel))]
    public async Task<IActionResult> GetRoleByName(string name)
    {
      if (!(await _authorizationService.AuthorizeAsync(this.User, name, Authorization.Policies.ViewRoleByRoleNamePolicy)).Succeeded)
      {
        return new ChallengeResult();
      }

      RoleViewModel roleVM = await GetRoleViewModelHelper(name);

      if (roleVM == null)
      {
        return NotFound(name);
      }

      return Ok(roleVM);
    }

    [HttpGet("roles")]
    [Produces(typeof(List<RoleViewModel>))]
    [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
    public async Task<IActionResult> GetRoles()
    {
      return await GetRoles(-1, -1);
    }

    [HttpGet("roles/{page:int}/{pageSize:int}")]
    [Produces(typeof(List<RoleViewModel>))]
    [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
    public async Task<IActionResult> GetRoles(int page, int pageSize)
    {
      var roles = await _accountManager.GetRolesLoadRelatedAsync(page, pageSize);
      return Ok(Mapper.Map<List<RoleViewModel>>(roles));
    }



    [HttpPut("roles/{id}")]
    [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleViewModel role)
    {
      if (ModelState.IsValid)
      {
        if (role == null)
        {
          return BadRequest($"{nameof(role)} cannot be null");
        }

        if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
        {
          return BadRequest("Conflicting role id in parameter and model data");
        }

        ApplicationRole appRole = await _accountManager.GetRoleByIdAsync(id);

        if (appRole == null)
        {
          return NotFound(id);
        }

        Mapper.Map<RoleViewModel, ApplicationRole>(role, appRole);

        var result = await _accountManager.UpdateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray());
        if (result.Item1)
        {
          return NoContent();
        }
        AddErrors(result.Item2);

      }

      return BadRequest(ModelState);
    }

    [HttpPost("roles")]
    [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
    public async Task<IActionResult> CreateRole([FromBody] RoleViewModel role)
    {
      if (ModelState.IsValid)
      {
        if (role == null)
        {
          return BadRequest($"{nameof(role)} cannot be null");
        }

        ApplicationRole appRole = Mapper.Map<ApplicationRole>(role);

        var result = await _accountManager.CreateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray());
        if (result.Item1)
        {
          RoleViewModel roleVM = await GetRoleViewModelHelper(appRole.Name);
          return CreatedAtAction(GetRoleByIdActionName, new { id = roleVM.Id }, roleVM);
        }

        AddErrors(result.Item2);
      }

      return BadRequest(ModelState);
    }

    [HttpDelete("roles/{id}")]
    [Produces(typeof(RoleViewModel))]
    [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
    public async Task<IActionResult> DeleteRole(string id)
    {
      if (!await _accountManager.TestCanDeleteRoleAsync(id))
      {
        return BadRequest("Role cannot be deleted. Remove all users from this role and try again");
      }

      RoleViewModel roleVM = null;
      ApplicationRole appRole = await this._accountManager.GetRoleByIdAsync(id);

      if (appRole != null)
      {
        roleVM = await GetRoleViewModelHelper(appRole.Name);
      }


      if (roleVM == null)
      {
        return NotFound(id);
      }

      var result = await this._accountManager.DeleteRoleAsync(appRole);
      if (!result.Item1)
      {
        throw new Exception("The following errors occurred whilst deleting role: " + string.Join(", ", result.Item2));
      }

      return Ok(roleVM);
    }

  }

}
