using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TicketBooking.Core.Entities;

[Table("seats")]
public class Seat : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("reference_id")]
    public Guid ReferenceId { get; set; }

    [Column("reference_type")]
    public string ReferenceType { get; set; } = string.Empty;

    [Column("seat_number")]
    public string SeatNumber { get; set; } = string.Empty;

    [Column("is_booked")]
    public bool IsBooked { get; set; } = false;
}