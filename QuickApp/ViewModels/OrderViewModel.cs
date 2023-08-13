// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using System;
using System.Linq;

namespace QuickApp.ViewModels
{
    public class OrderViewModel
    {
        public int Id { get; set; }
        public decimal Discount { get; set; }
        public string Comments { get; set; }
    }
}
