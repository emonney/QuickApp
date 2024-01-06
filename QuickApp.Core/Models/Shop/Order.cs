// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using QuickApp.Core.Models.Account;

namespace QuickApp.Core.Models.Shop
{
    public class Order : BaseEntity
    {
        public decimal Discount { get; set; }
        public string? Comments { get; set; }

        public string? CashierId { get; set; }
        public ApplicationUser? Cashier { get; set; }

        public int CustomerId { get; set; }
        public required Customer Customer { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; } = new List<OrderDetail>();
    }
}
