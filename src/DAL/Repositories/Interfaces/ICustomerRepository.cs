using PskOnline.DAL.Models;
using System.Collections.Generic;

namespace PskOnline.DAL.Repositories.Interfaces
{
  public interface ICustomerRepository : IRepository<Customer>
  {
    IEnumerable<Customer> GetAllCustomersData();
  }
}
