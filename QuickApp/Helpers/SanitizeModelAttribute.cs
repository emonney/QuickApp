// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;

namespace QuickApp.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class SanitizeModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            foreach (var arg in context.ActionArguments.Values)
            {
                if (arg is ISanitizeModel model)
                {
                    model.SanitizeModel();
                }
            }
        }
    }

    public interface ISanitizeModel
    {
        public void SanitizeModel();
    }
}
