namespace PskOnline.DAL.Repositories
{
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using PskOnline.DAL.Models;
  using PskOnline.DAL.Repositories.Interfaces;

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
          .OrderBy(c => c.Name)
          .ToList();
    }

    private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
  }
}
