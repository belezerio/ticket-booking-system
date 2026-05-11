using TicketBooking.Core.Entities;

namespace TicketBooking.Core.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(Guid id);
    Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking> UpdateStatusAsync(Guid id, string status);
    Task<bool> DeleteAsync(Guid id);
}