using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TicketBooking.Core.Entities;

[Table("user_profiles")]
public class UserProfile : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("phone")]
    public string? Phone { get; set; }

    [Column("role")]
    public string Role { get; set; } = "customer";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}