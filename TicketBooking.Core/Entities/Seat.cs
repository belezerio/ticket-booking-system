namespace TicketBooking.Core.Entities;

public class Seat
{
    public Guid Id { get; set; }
    public Guid ReferenceId { get; set; }
    public string ReferenceType { get; set; } = string.Empty;
    public string SeatNumber { get; set; } = string.Empty;
    public bool IsBooked { get; set; } = false;
}