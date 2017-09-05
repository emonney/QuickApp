//// ======================================
//// Author: Ebenezer Monney
//// Email:  info@ebenmonney.com
//// Copyright (c) 2017 www.ebenmonney.com
//// 
//// ==> Gun4Hire: contact@ebenmonney.com
//// ======================================

//using System;
//using Microsoft.Extensions.Configuration;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Design;
//using DAL;
//using System.IO;
//using System.Reflection;

//namespace QuickApp
//{
//    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
//    {
//        public ApplicationDbContext CreateDbContext(string[] args)
//        {
//            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
//            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();

//            builder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
//                b => b.MigrationsAssembly(typeof(DesignTimeDbContextFactory).GetTypeInfo().Assembly.GetName().Name));

//            return new ApplicationDbContext(builder.Options);
//        }
//    }
//}
