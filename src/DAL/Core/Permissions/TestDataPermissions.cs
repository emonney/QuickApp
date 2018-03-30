namespace DAL.Core.Permissions
{
  using System.Collections.Generic;
  using System.Collections.ObjectModel;

  /// <summary>
  /// Defines permissions related to Test Data objects,
  /// including Inspection, InspectionTest, Summary & TestSummary
  /// </summary>
  class TestDataPermissions
  {
    public const string TestDataPermissionsGroupName = "Test Data Permissions";
    public const string TestPermGroup = "testdata";

    public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

    static TestDataPermissions()
    {
      AllPermissions = new List<ApplicationPermission>()
        {
          Test_Self_Submit,
          Test_Self_Read,
          Test_Department_Submit,
          Test_Department_Read,
          Test_Org_Read,
          Test_Tenant_Submit,
          Test_Tenant_Read
        }.AsReadOnly();
    }

    public static ApplicationPermission Test_Self_Submit =>
        new ApplicationPermission(
            "Submit own test data",
            TestPermGroup, PermScope.Self, PermAction.Submit,
            TestDataPermissionsGroupName,
            "Permission to submit one's own test data");

    public static ApplicationPermission Test_Self_Read =>
        new ApplicationPermission(
            "View own test data",
            TestPermGroup, PermScope.Self, PermAction.Read,
            TestDataPermissionsGroupName,
            "Permission to view one's own test data");

    public static ApplicationPermission Test_Department_Submit =>
        new ApplicationPermission(
            "Submit department test data",
            TestPermGroup, PermScope.Department, PermAction.Submit,
            TestDataPermissionsGroupName,
            "Permission to submit test data for own department");

    public static ApplicationPermission Test_Department_Read =>
        new ApplicationPermission(
            "View department test data",
            TestPermGroup, PermScope.Department, PermAction.Read,
            TestDataPermissionsGroupName,
            "Permission to view test data for own department");

    public static ApplicationPermission Test_Org_Read =>
        new ApplicationPermission(
            "View organization test data",
            TestPermGroup, PermScope.Organization, PermAction.Read,
            TestDataPermissionsGroupName,
            "Permission to view test data for own organization");

    public static ApplicationPermission Test_Tenant_Submit =>
        new ApplicationPermission(
            "Submit test data for own tenant",
            TestPermGroup, PermScope.Tenant, PermAction.Submit,
            TestDataPermissionsGroupName,
            "Permission to submit test data for own tenant");

    public static ApplicationPermission Test_Tenant_Read =>
        new ApplicationPermission(
            "View test data for own tenant",
            TestPermGroup, PermScope.Tenant, PermAction.Read,
            TestDataPermissionsGroupName,
            "Permission to view test data for own tenant");

  }
}
