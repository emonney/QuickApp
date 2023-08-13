// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;

namespace QuickApp
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            builder.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"], b => b.MigrationsAssembly("QuickApp"));

            return new ApplicationDbContext(builder.Options);
        }
    }
}
