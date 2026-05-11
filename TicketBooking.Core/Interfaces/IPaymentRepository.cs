using TicketBooking.Core.Entities;

namespace TicketBooking.Core.Interfaces;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(Guid id);
    Task<Payment?> GetByBookingIdAsync(Guid bookingId);
    Task<Payment> CreateAsync(Payment payment);
    Task<Payment> UpdateStatusAsync(Guid id, string status);
}