// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using QuickApp.Core.Extensions;
using QuickApp.Server.Attributes;
using System.ComponentModel.DataAnnotations;

namespace QuickApp.Server.ViewModels.Account
{
    public class UserVM : UserBaseVM
    {
        public bool IsLockedOut { get; set; }

        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[]? Roles { get; set; }
    }

    public class UserEditVM : UserBaseVM
    {
        public string? CurrentPassword { get; set; }

        [MinLength(6, ErrorMessage = "New Password must be at least 6 characters")]
        public string? NewPassword { get; set; }

        [MinimumCount(1, false, ErrorMessage = "Roles cannot be empty")]
        public string[]? Roles { get; set; }
    }

    public class UserPatchVM
    {
        public string? FullName { get; set; }

        public string? JobTitle { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Configuration { get; set; }
    }

    public abstract class UserBaseVM : ISanitizeModel
    {
        public virtual void SanitizeModel()
        {
            Id = Id.NullIfWhiteSpace();
            FullName = FullName.NullIfWhiteSpace();
            JobTitle = JobTitle.NullIfWhiteSpace();
            PhoneNumber = PhoneNumber.NullIfWhiteSpace();
            Configuration = Configuration.NullIfWhiteSpace();
        }

        public string? Id { get; set; }

        [Required(ErrorMessage = "Username is required"),
         StringLength(200, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 200 characters")]
        public required string UserName { get; set; }

        public string? FullName { get; set; }

        [Required(ErrorMessage = "Email is required"),
         StringLength(200, ErrorMessage = "Email must be at most 200 characters"),
         EmailAddress(ErrorMessage = "Invalid email address")]
        public required string Email { get; set; }

        public string? JobTitle { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Configuration { get; set; }

        public bool IsEnabled { get; set; }
    }
}
