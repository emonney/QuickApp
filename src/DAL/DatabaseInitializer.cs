using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Permissions;
using DAL.Core.Interfaces;

namespace DAL
{
  using DAL.Core.Roles;

  public interface IDatabaseInitializer
  {
    Task SeedAsync();
  }




  public class DatabaseInitializer : IDatabaseInitializer
  {
    private readonly ApplicationDbContext _context;
    private readonly IAccountManager _accountManager;
    private readonly ILogger _logger;

    public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
    {
      _accountManager = accountManager;
      _context = context;
      _logger = logger;
    }

    public async Task SeedAsync()
    {
      await _context.Database.MigrateAsync().ConfigureAwait(false);

      if (!await _context.Users.AnyAsync())
      {
        _logger.LogInformation("Generating inbuilt accounts");

        var adminRoleName = ApplicationRoles.GetBuiltInAdminRoleDefinition().Name;

        var standardRoles = ApplicationRoles.GetAllRoles();
        foreach( RoleDefinition roleDef in standardRoles )
        {
          var permValues = (from p in roleDef.Permissions select p.Value).ToArray();
          await EnsureRoleAsync(roleDef.Name, roleDef.Description, permValues);
        }

        await CreateUserAsync("admin", "tempP@ss123", "Inbuilt Administrator", "admin@ebenmonney.com", "+1 (123) 000-0000", new string[] { adminRoleName });

        _logger.LogInformation("Inbuilt account generation completed");
      }



      if (!await _context.Customers.AnyAsync())
      {
        _logger.LogInformation("Seeding initial data");

        Customer cust_1 = new Customer
        {
          Name = "FAKE_Irkutskenergo",
          PrimaryContactEmail = "contact@irkutskenergo.ru",
          ServiceMaxPatients = 10,
          ServiceExpireDate = DateTime.Now + TimeSpan.FromDays(30),
          ServiceMaxStorageMegabytes = 1000, // 1 Gigabyte by default
          DateCreated = DateTime.UtcNow,
          DateModified = DateTime.UtcNow
        };

        Customer cust_2 = new Customer
        {
          Name = "FAKE_Mosenergo",
          PrimaryContactEmail = "contact@mosenergo.ru",
          ServiceMaxPatients = 10,
          ServiceExpireDate = DateTime.Now + TimeSpan.FromDays(60),
          ServiceMaxStorageMegabytes = 1000, // 1 Gigabyte by default
          DateCreated = DateTime.UtcNow,
          DateModified = DateTime.UtcNow
        };

        Customer cust_3 = new Customer
        {
          Name = "FAKE_RusHydro",
          PrimaryContactEmail = "contact@rushydro.ru",
          ServiceMaxPatients = 10,
          ServiceExpireDate = DateTime.Now + TimeSpan.FromDays(60),
          ServiceMaxStorageMegabytes = 1000, // 1 Gigabyte by default
          DateCreated = DateTime.UtcNow,
          DateModified = DateTime.UtcNow
        };

        _context.Customers.Add(cust_1);
        _context.Customers.Add(cust_2);
        _context.Customers.Add(cust_3);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeding initial data completed");
      }
    }



    private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
    {
      if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
      {
        ApplicationRole applicationRole = new ApplicationRole(roleName, description);

        var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

        if (!result.Item1)
          throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");
      }
    }

    private async Task<ApplicationUser> CreateUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
    {
      ApplicationUser applicationUser = new ApplicationUser
      {
        UserName = userName,
        FullName = fullName,
        Email = email,
        PhoneNumber = phoneNumber,
        EmailConfirmed = true,
        IsEnabled = true
      };

      var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

      if (!result.Item1)
        throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");


      return applicationUser;
    }
  }
}
