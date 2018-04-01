using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories.Interfaces
{
  public interface ICustomerRepository : IRepository<Customer>
  {
    IEnumerable<Customer> GetAllCustomersData();
  }
}
