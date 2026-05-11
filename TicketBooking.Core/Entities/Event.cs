using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TicketBooking.Core.Entities;

[Table("events")]
public class Event : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("category")]
    public string Category { get; set; } = string.Empty;

    [Column("venue")]
    public string Venue { get; set; } = string.Empty;

    [Column("event_date")]
    public DateTime EventDate { get; set; }

    [Column("total_seats")]
    public int TotalSeats { get; set; }

    [Column("available_seats")]
    public int AvailableSeats { get; set; }

    [Column("price")]
    public decimal Price { get; set; }

    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}