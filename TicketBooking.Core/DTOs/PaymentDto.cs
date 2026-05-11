namespace TicketBooking.Core.DTOs;

public record InitiatePaymentDto(
    Guid BookingId,
    string PaymentMethod
);

public record PaymentDto(
    Guid Id,
    Guid BookingId,
    decimal Amount,
    string Status,
    string PaymentMethod,
    string? TransactionId,
    DateTime? PaidAt
);