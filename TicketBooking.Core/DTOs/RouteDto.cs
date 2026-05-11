namespace TicketBooking.Core.DTOs;

public record RouteDto(
    Guid Id,
    string Type,
    string Operator,
    string Source,
    string Destination,
    DateTime DepartureTime,
    DateTime ArrivalTime,
    int TotalSeats,
    int AvailableSeats,
    decimal Price,
    bool IsActive
);

public record CreateRouteDto(
    string Type,
    string Operator,
    string Source,
    string Destination,
    DateTime DepartureTime,
    DateTime ArrivalTime,
    int TotalSeats,
    decimal Price
);