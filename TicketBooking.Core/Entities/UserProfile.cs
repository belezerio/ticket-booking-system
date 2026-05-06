namespace TicketBooking.Core.Entities;

public class UserProfile
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = "customer";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}