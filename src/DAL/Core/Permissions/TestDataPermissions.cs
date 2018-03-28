using System;
using System.Collections.Generic;
using System.Text;
using System.Collections.ObjectModel;

namespace DAL.Core.Permissions
{
    /// <summary>
    /// defines permissions to submit / view test data
    /// </summary>
    class TestDataPermissions
    {
        public const string TestDataPermissionsGroupName = "Test Data Permissions";
        public const string GroupPrefix = "testdata";

        public static ReadOnlyCollection<ApplicationPermission> allPermissions
        {
          get
          {
            return new List<ApplicationPermission>()
            {
              TestRead_Department, TestRead_Self, TestRead_Tenant,
              TestSubmit_Department, TestSubmit_Self, TestSubmit_Tenant
            }.AsReadOnly();
          }
        }

        public static ApplicationPermission TestSubmit_Self =>
            new ApplicationPermission(
                "Submit own test data",
                GroupPrefix + "." + PermissionScope.Self + "." + "submit",
                TestDataPermissionsGroupName,
                "Permission to submit one's own test data");

        public static ApplicationPermission TestRead_Self =>
            new ApplicationPermission(
                "View own test data",
                GroupPrefix + "." + PermissionScope.Self + "read",
                TestDataPermissionsGroupName,
                "Permission to view one's own test data");

    public static ApplicationPermission TestSubmit_Department =>
            new ApplicationPermission(
                "Submit department test data",
                GroupPrefix + ".submit.department",
                TestDataPermissionsGroupName, 
                "Permission to submit test data for own department");

        public static ApplicationPermission TestRead_Department =>
            new ApplicationPermission(
                "View department test data",
                GroupPrefix + ".read.department",
                TestDataPermissionsGroupName,
                "Permission to view test data for own department");

        public static ApplicationPermission TestSubmit_Tenant =>
            new ApplicationPermission(
                "Submit test data for own tenant",
                GroupPrefix + ".submit.tenant",
                TestDataPermissionsGroupName,
                "Permission to submit test data for own tenant");

        public static ApplicationPermission TestRead_Tenant =>
            new ApplicationPermission(
                "View test data for own tenant",
                GroupPrefix + ".read.tenant",
                TestDataPermissionsGroupName,
                "Permission to view test data for own tenant");


  }
}
