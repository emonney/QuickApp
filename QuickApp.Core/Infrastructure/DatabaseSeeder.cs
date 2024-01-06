// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuickApp.Core.Models;
using QuickApp.Core.Models.Account;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Account;

namespace QuickApp.Core.Infrastructure
{
    public class DatabaseSeeder(ApplicationDbContext dbContext, ILogger<DatabaseSeeder> logger,
        IUserAccountService userAccountService, IUserRoleService userRoleService) : IDatabaseSeeder
    {
        public async Task SeedAsync()
        {
            await dbContext.Database.MigrateAsync();
            await SeedDefaultUsersAsync();
            await SeedDemoDataAsync();
        }

        /************ DEFAULT USERS **************/

        private async Task SeedDefaultUsersAsync()
        {
            if (!await dbContext.Users.AnyAsync())
            {
                logger.LogInformation("Generating inbuilt accounts");

                const string adminRoleName = "administrator";
                const string userRoleName = "user";

                await EnsureRoleAsync(adminRoleName, "Default administrator",
                    ApplicationPermissions.GetAllPermissionValues());

                await EnsureRoleAsync(userRoleName, "Default user", []);

                await CreateUserAsync("admin",
                                      "tempP@ss123",
                                      "Inbuilt Administrator",
                                      "admin@ebenmonney.com",
                                      "+1 (123) 000-0000",
                                      [adminRoleName]);

                await CreateUserAsync("user",
                                      "tempP@ss123",
                                      "Inbuilt Standard User",
                                      "user@ebenmonney.com",
                                      "+1 (123) 000-0001",
                                      [userRoleName]);

                logger.LogInformation("Inbuilt account generation completed");
            }
        }

        private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
        {
            if (await userRoleService.GetRoleByNameAsync(roleName) == null)
            {
                logger.LogInformation("Generating default role: {roleName}", roleName);

                var applicationRole = new ApplicationRole(roleName, description);

                var result = await userRoleService.CreateRoleAsync(applicationRole, claims);

                if (!result.Succeeded)
                {
                    throw new UserRoleException($"Seeding \"{description}\" role failed. Errors: " +
                        $"{string.Join(Environment.NewLine, result.Errors)}");
                }
            }
        }

        private async Task<ApplicationUser> CreateUserAsync(
            string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
        {
            logger.LogInformation("Generating default user: {userName}", userName);

            var applicationUser = new ApplicationUser
            {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
            };

            var result = await userAccountService.CreateUserAsync(applicationUser, roles, password);

            if (!result.Succeeded)
            {
                throw new UserAccountException($"Seeding \"{userName}\" user failed. Errors: " +
                    $"{string.Join(Environment.NewLine, result.Errors)}");
            }

            return applicationUser;
        }

        /************ DEMO DATA **************/

        private async Task SeedDemoDataAsync()
        {
            if (!await dbContext.Customers.AnyAsync() && !await dbContext.ProductCategories.AnyAsync())
            {
                logger.LogInformation("Seeding demo data");

                var cust_1 = new Customer
                {
                    Name = "Ebenezer Monney",
                    Email = "contact@ebenmonney.com",
                    Gender = Gender.Male
                };

                var cust_2 = new Customer
                {
                    Name = "Itachi Uchiha",
                    Email = "uchiha@narutoverse.com",
                    PhoneNumber = "+81123456789",
                    Address = "Some fictional Address, Street 123, Konoha",
                    City = "Konoha",
                    Gender = Gender.Male
                };

                var cust_3 = new Customer
                {
                    Name = "John Doe",
                    Email = "johndoe@anonymous.com",
                    PhoneNumber = "+18585858",
                    Address = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                    Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at elementum imperdiet",
                    City = "Lorem Ipsum",
                    Gender = Gender.Male
                };

                var cust_4 = new Customer
                {
                    Name = "Jane Doe",
                    Email = "Janedoe@anonymous.com",
                    PhoneNumber = "+18585858",
                    Address = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                    Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at elementum imperdiet",
                    City = "Lorem Ipsum",
                    Gender = Gender.Male
                };

                var prodCat_1 = new ProductCategory
                {
                    Name = "None",
                    Description = "Default category. Products that have not been assigned a category"
                };

                var prod_1 = new Product
                {
                    Name = "BMW M6",
                    Description = "Yet another masterpiece from the world's best car manufacturer",
                    BuyingPrice = 109775,
                    SellingPrice = 114234,
                    UnitsInStock = 12,
                    IsActive = true,
                    ProductCategory = prodCat_1
                };

                var prod_2 = new Product
                {
                    Name = "Nissan Patrol",
                    Description = "A true man's choice",
                    BuyingPrice = 78990,
                    SellingPrice = 86990,
                    UnitsInStock = 4,
                    IsActive = true,
                    ProductCategory = prodCat_1
                };

                var ordr_1 = new Order
                {
                    Discount = 500,
                    Cashier = await dbContext.Users.OrderBy(u => u.UserName).FirstAsync(),
                    Customer = cust_1
                };

                var ordr_2 = new Order
                {
                    Cashier = await dbContext.Users.OrderBy(u => u.UserName).FirstAsync(),
                    Customer = cust_2
                };

                ordr_1.OrderDetails.Add(new()
                {
                    UnitPrice = prod_1.SellingPrice,
                    Quantity = 1,
                    Product = prod_1,
                    Order = ordr_1
                });
                ordr_1.OrderDetails.Add(new()
                {
                    UnitPrice = prod_2.SellingPrice,
                    Quantity = 1,
                    Product = prod_2,
                    Order = ordr_1
                });

                ordr_2.OrderDetails.Add(new()
                {
                    UnitPrice = prod_2.SellingPrice,
                    Quantity = 1,
                    Product = prod_2,
                    Order = ordr_2
                });

                dbContext.Customers.Add(cust_1);
                dbContext.Customers.Add(cust_2);
                dbContext.Customers.Add(cust_3);
                dbContext.Customers.Add(cust_4);

                dbContext.Products.Add(prod_1);
                dbContext.Products.Add(prod_2);

                dbContext.Orders.Add(ordr_1);
                dbContext.Orders.Add(ordr_2);

                await dbContext.SaveChangesAsync();

                logger.LogInformation("Seeding demo data completed");
            }
        }
    }
}
