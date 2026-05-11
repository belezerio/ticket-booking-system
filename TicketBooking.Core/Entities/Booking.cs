using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TicketBooking.Core.Entities;

[Table("bookings")]
public class Booking : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("reference_id")]
    public Guid ReferenceId { get; set; }

    [Column("reference_type")]
    public string ReferenceType { get; set; } = string.Empty;

    [Column("seat_numbers")]
    public string[] SeatNumbers { get; set; } = [];

    [Column("total_amount")]
    public decimal TotalAmount { get; set; }

    [Column("status")]
    public string Status { get; set; } = "pending";

    [Column("booking_date")]
    public DateTime BookingDate { get; set; }

    [Column("cancellation_date")]
    public DateTime? CancellationDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}