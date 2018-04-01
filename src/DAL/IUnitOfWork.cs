namespace DAL
{
  using DAL.Repositories.Interfaces;

  public interface IUnitOfWork
  {
    ICustomerRepository Customers { get; }

    int SaveChanges();
  }
}
