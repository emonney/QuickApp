namespace PskOnline.DAL.Core.Roles
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;
  using DAL.Core.Permissions;

  public class RoleDefinition
  {
      public RoleDefinition(
        string Name,
        string Description,
        IEnumerable<ApplicationPermission> permissions
        )
    {
      this.Name = Name;
      this.Description = Description;
      var perm = new List<ApplicationPermission>();
      perm.AddRange(permissions);
      this.Permissions = perm.AsReadOnly();
    }

    public string Name { get; set; }

    public string Description { get; set; }

    public ReadOnlyCollection<ApplicationPermission> Permissions { get; set; }
  }
}
