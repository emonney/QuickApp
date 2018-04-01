using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuickApp.Controllers
{
  using Microsoft.AspNetCore.Mvc;

  public class BaseController : Controller
    {
      protected void AddErrors(IEnumerable<string> errors)
      {
        foreach (var error in errors)
        {
          ModelState.AddModelError(string.Empty, error);
        }
      }

  }
}
