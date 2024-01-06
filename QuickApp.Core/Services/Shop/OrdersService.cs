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
using System.Linq;

namespace QuickApp.Core.Services.Shop
{
    public class OrdersRepository : Repository<Order>, IOrdersRepository
    {
        public OrdersRepository(DbContext context) : base(context)
        { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
