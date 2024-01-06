// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.EntityFrameworkCore;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace QuickApp.Core.Services.Shop
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(ApplicationDbContext context) : base(context)
        { }

        public IEnumerable<Customer> GetTopActiveCustomers(int count)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Customer> GetAllCustomersData()
        {
            return _appContext.Customers
                .Include(c => c.Orders).ThenInclude(o => o.OrderDetails).ThenInclude(d => d.Product)
                .Include(c => c.Orders).ThenInclude(o => o.Cashier)
                .AsSingleQuery()
                .OrderBy(c => c.Name)
                .ToList();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
