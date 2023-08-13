// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using DAL.Core;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace DAL
{
    public class HttpUnitOfWork : UnitOfWork
    {
        public HttpUnitOfWork(ApplicationDbContext context, IHttpContextAccessor httpAccessor) : base(context)
        {
            context.CurrentUserId = httpAccessor.HttpContext?.User.FindFirst(ClaimConstants.Subject)?.Value?.Trim();
        }
    }
}
