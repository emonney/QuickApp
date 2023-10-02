// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using System;
using System.Linq;

namespace DAL.Core
{
    public static class ClaimConstants
    {
        ///<summary>A claim that specifies the subject of an entity</summary>
        public const string Subject = "sub";

        ///<summary>A claim that specifies the permission of an entity</summary>
        public const string Permission = "permission";
    }

    public static class PropertyConstants
    {

        ///<summary>A property that specifies the full name of an entity</summary>
        public const string FullName = "fullname";

        ///<summary>A property that specifies the job title of an entity</summary>
        public const string JobTitle = "jobtitle";

        ///<summary>A property that specifies the configuration/customizations of an entity</summary>
        public const string Configuration = "configuration";
    }
}
