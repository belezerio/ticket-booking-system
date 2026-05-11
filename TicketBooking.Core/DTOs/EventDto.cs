namespace TicketBooking.Core.DTOs;

public record EventDto(
    Guid Id,
    string Title,
    string? Description,
    string Category,
    string Venue,
    DateTime EventDate,
    int TotalSeats,
    int AvailableSeats,
    decimal Price,
    string? ImageUrl,
    bool IsActive
);

public record CreateEventDto(
    string Title,
    string? Description,
    string Category,
    string Venue,
    DateTime EventDate,
    int TotalSeats,
    decimal Price,
    string? ImageUrl
);