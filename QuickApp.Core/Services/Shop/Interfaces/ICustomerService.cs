// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using QuickApp.Core.Models.Shop;
using System;
using System.Collections.Generic;
using System.Linq;

namespace QuickApp.Core.Services.Shop.Interfaces
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        IEnumerable<Customer> GetTopActiveCustomers(int count);
        IEnumerable<Customer> GetAllCustomersData();
    }
}
