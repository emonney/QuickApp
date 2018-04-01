using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Core
{
    public static class CustomClaimTypes
    {
        ///<summary>A claim that specifies the permission of an entity</summary>
        public const string Permission = "permission";

        public const string TenantId = "TenantId";

        /// <summary>
        /// A claim that defines the scope that the principal is defined at
        /// (either Patient, Department, Tenant or Global)
        /// Patient & Department are special principals,
        /// While Tenant & Global are 'regular' users
        /// </summary>
        public const string PrincipalLevel = "PrincipaLevel";

        /// <summary>
        /// The ID of the entity that the Principal belongs to.
        /// Depending on the PrincipalLevel, refers to either a 
        /// patient, a department, a tenant, or nothing (for site-level principal)
        /// </summary>
        public const string EntityId = "EntityId";

        ///<summary>A claim that specifies the full name of an entity</summary>
        public const string FullName = "fullname";

        ///<summary>A claim that specifies the job title of an entity</summary>
        public const string JobTitle = "jobtitle";

        ///<summary>A claim that specifies the email of an entity</summary>
        public const string Email = "email";

        ///<summary>A claim that specifies the phone number of an entity</summary>
        public const string Phone = "phone";

        ///<summary>A claim that specifies the configuration/customizations of an entity</summary>
        public const string Configuration = "configuration";
    }
}
