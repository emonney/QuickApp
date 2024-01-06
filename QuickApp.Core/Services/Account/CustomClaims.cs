// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Core.Services.Account
{
    public static class CustomClaims
    {
        ///<summary>A claim that specifies the full name of an entity</summary>
        public const string FullName = "fullname";

        ///<summary>A claim that specifies the job title of an entity</summary>
        public const string JobTitle = "jobtitle";

        ///<summary>A claim that specifies the configuration/customizations of an entity</summary>
        public const string Configuration = "configuration";

        ///<summary>A claim that specifies the permission of an entity</summary>
        public const string Permission = "permission";
    }
}
