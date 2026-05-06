namespace TicketBooking.Core.Entities;

public class Booking
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ReferenceId { get; set; }
    public string ReferenceType { get; set; } = string.Empty;
    public string[] SeatNumbers { get; set; } = [];
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime BookingDate { get; set; }
    public DateTime? CancellationDate { get; set; }
    public DateTime CreatedAt { get; set; }
}