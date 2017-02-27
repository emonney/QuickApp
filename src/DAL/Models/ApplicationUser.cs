// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// ======================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace DAL.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string JobTitle { get; set; }
        public string FullName { get; set; }
        public string Configuration { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsLockedOut { get { return this.LockoutEnabled && this.LockoutEnd >= DateTimeOffset.UtcNow; } }

        public ICollection<Order> Orders { get; set; }
    }
}
