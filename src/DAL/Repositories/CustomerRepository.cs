namespace DAL.Repositories
{
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using DAL.Models;
  using DAL.Repositories.Interfaces;

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
