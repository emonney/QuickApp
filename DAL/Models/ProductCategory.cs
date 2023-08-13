// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Models
{
    public class ProductCategory : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
