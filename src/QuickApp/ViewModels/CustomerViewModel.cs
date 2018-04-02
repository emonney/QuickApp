using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PskOnline.Service.ViewModels
{
  public class CustomerViewModel
  {
    public int Id { get; set; }

    public string Name { get; set; }

    public string Comment { get; set; }

    public string PrimaryContactName { get; set; }

    public string PrimaryContactEmail { get; set; }

    public string PrimaryContactPhoneNumber { get; set; }

    public string PhoneNumber { get; set; }

    public string AlternameContactName { get; set; }

    public string AlternateContactEmail { get; set; }

    public string AlternateContactPhoneNumber { get; set; }

    public string Address { get; set; }

    public string City { get; set; }

    public DateTime ServiceExpireDate { get; set; }

    public int ServiceMaxUsers { get; set; }

    public int ServiceMaxStorageMegabytes { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime DateModified { get; set; }
  }




  public class CustomerViewModelValidator : AbstractValidator<CustomerViewModel>
  {
    public CustomerViewModelValidator()
    {
      RuleFor(register => register.Name).NotEmpty().WithMessage("Customer name cannot be empty");
    }
  }
}
