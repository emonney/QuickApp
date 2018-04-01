namespace PskOnline.Service.ViewModels
{
  using AutoMapper;
  using PskOnline.DAL.Core.Permissions;
  using PskOnline.DAL.Models;
  using Microsoft.AspNetCore.Identity;

  public class AutoMapperProfile : Profile
  {
    public AutoMapperProfile()
    {
      CreateMap<ApplicationUser, UserViewModel>()
             .ForMember(d => d.Roles, map => map.Ignore());
      CreateMap<UserViewModel, ApplicationUser>()
          .ForMember(d => d.Roles, map => map.Ignore());

      CreateMap<ApplicationUser, UserEditViewModel>()
          .ForMember(d => d.Roles, map => map.Ignore());
      CreateMap<UserEditViewModel, ApplicationUser>()
          .ForMember(d => d.Roles, map => map.Ignore());

      CreateMap<ApplicationUser, UserPatchViewModel>()
          .ReverseMap();

      CreateMap<ApplicationRole, RoleViewModel>()
          .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
          .ForMember(d => d.UsersCount, map => map.ResolveUsing(s => s.Users?.Count ?? 0))
          .ReverseMap();
      CreateMap<RoleViewModel, ApplicationRole>();

      CreateMap<IdentityRoleClaim<string>, ClaimViewModel>()
          .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
          .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
          .ReverseMap();

      CreateMap<ApplicationPermission, PermissionViewModel>()
          .ReverseMap();

      CreateMap<IdentityRoleClaim<string>, PermissionViewModel>()
          .ConvertUsing(s => Mapper.Map<PermissionViewModel>(ApplicationPermissions.GetPermissionByValue(s.ClaimValue)));

      CreateMap<Customer, CustomerViewModel>()
          .ReverseMap();

    }
  }
}
