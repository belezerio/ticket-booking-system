namespace TicketBooking.Core.DTOs;

public record CreateBookingDto(
    Guid ReferenceId,
    string ReferenceType,
    string[] SeatNumbers
);

public record BookingDto(
    Guid Id,
    Guid UserId,
    Guid ReferenceId,
    string ReferenceType,
    string[] SeatNumbers,
    decimal TotalAmount,
    string Status,
    DateTime BookingDate,
    DateTime? CancellationDate
);