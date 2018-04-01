namespace PskOnline.DAL
{
  using PskOnline.DAL.Repositories.Interfaces;

  public interface IUnitOfWork
  {
    ICustomerRepository Customers { get; }

    int SaveChanges();
  }
}
