namespace DAL.Models
{
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;
  using Microsoft.AspNetCore.Identity;
  using DAL.Models.Interfaces;

  public class ApplicationUser : IdentityUser, IAuditableEntity
  {
    public string JobTitle { get; set; }

    public string FullName { get; set; }

    public string Configuration { get; set; }

    public bool IsEnabled { get; set; }

    public bool IsLockedOut => this.LockoutEnabled && this.LockoutEnd >= DateTimeOffset.UtcNow;

    public string CreatedBy { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    /// <summary>
    /// Navigation property for the roles this user belongs to.
    /// </summary>
    public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }

    /// <summary>
    /// Navigation property for the claims this user possesses.
    /// </summary>
    public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

  }
}
