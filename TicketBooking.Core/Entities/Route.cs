using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TicketBooking.Core.Entities;

[Table("routes")]
public class Route : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("type")]
    public string Type { get; set; } = string.Empty;

    [Column("operator")]
    public string Operator { get; set; } = string.Empty;

    [Column("source")]
    public string Source { get; set; } = string.Empty;

    [Column("destination")]
    public string Destination { get; set; } = string.Empty;

    [Column("departure_time")]
    public DateTime DepartureTime { get; set; }

    [Column("arrival_time")]
    public DateTime ArrivalTime { get; set; }

    [Column("total_seats")]
    public int TotalSeats { get; set; }

    [Column("available_seats")]
    public int AvailableSeats { get; set; }

    [Column("price")]
    public decimal Price { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}