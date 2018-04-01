namespace PskOnline.DAL.Models
{
  using System;
  using System.ComponentModel.DataAnnotations;

  public class Customer : AuditableEntity
  {
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public string PrimaryContactName { get; set; }

    public string PrimaryContactEmail { get; set; }

    public string PhoneNumber { get; set; }

    public string AlternameContactName { get; set; }

    public string AlternateContactEmail { get; set; }

    public string Address { get; set; }

    public string City { get; set; }

    public DateTime ServiceExpireDate { get; set; }

    public int ServiceMaxPatients { get; set; }

    public int ServiceMaxStorageMegabytes { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime DateModified { get; set; }
  }
}
