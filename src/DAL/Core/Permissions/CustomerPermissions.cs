namespace PskOnline.DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;

  /// <summary>
  /// Defines permissions related to Customer objects
  /// </summary>
  public static class CustomerPermissions
  {
    public const string CustomerGroupPrefix = "customers";

    public const string CustomerPermissionGroupName = "Customer Permissions";

    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    static CustomerPermissions()
    {
      AllPermissions = new List<ApplicationPermission>()
      {
        Customers_GLOBAL_View,
        Customers_GLOBAL_Manage
      }.AsReadOnly();
    }

    public static ApplicationPermission Customers_GLOBAL_View =>
      new ApplicationPermission("View GLOBAL Customers",
        CustomerGroupPrefix, PermScope.GLOBAL, PermAction.View,
        CustomerPermissionGroupName,
        "Permission to view details of customers (tenants)");

    public static ApplicationPermission Customers_GLOBAL_Manage =>
      new ApplicationPermission(
        "Manage GLOBAL Customers", 
        CustomerGroupPrefix, PermScope.GLOBAL, PermAction.Manage,
        CustomerPermissionGroupName, 
        "Permission to create, delete and modify customers (tenants)");

  }
}
