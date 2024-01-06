// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.ViewModels.Shop
{
    public class OrderVM
    {
        public int Id { get; set; }
        public decimal Discount { get; set; }
        public string? Comments { get; set; }
    }
}
