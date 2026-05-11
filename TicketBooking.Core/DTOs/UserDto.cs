namespace TicketBooking.Core.DTOs;

public record RegisterRequest(
    string FullName,
    string Email,
    string Password
);

public record LoginRequest(
    string Email,
    string Password
);

public record UserDto(
    Guid Id,
    string FullName,
    string? Phone,
    string Role
);

public record UpdateProfileDto(
    string FullName,
    string? Phone
);