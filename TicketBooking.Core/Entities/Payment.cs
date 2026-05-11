using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TicketBooking.Core.Entities;

[Table("payments")]
public class Payment : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("booking_id")]
    public Guid BookingId { get; set; }

    [Column("amount")]
    public decimal Amount { get; set; }

    [Column("status")]
    public string Status { get; set; } = "pending";

    [Column("payment_method")]
    public string PaymentMethod { get; set; } = string.Empty;

    [Column("transaction_id")]
    public string? TransactionId { get; set; }

    [Column("paid_at")]
    public DateTime? PaidAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}