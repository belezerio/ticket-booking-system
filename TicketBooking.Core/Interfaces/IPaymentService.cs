using TicketBooking.Core.DTOs;

namespace TicketBooking.Core.Interfaces;

public interface IPaymentService
{
    Task<PaymentDto> ProcessPaymentAsync(InitiatePaymentDto dto, Guid userId);
    Task<PaymentDto?> GetByBookingIdAsync(Guid bookingId);
    Task<PaymentDto> ProcessRefundAsync(Guid paymentId, Guid userId);
}