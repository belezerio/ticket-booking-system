using TicketBooking.Core.DTOs;

namespace TicketBooking.Core.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, Guid userId);
    Task<BookingDto> CancelBookingAsync(Guid bookingId, Guid userId);
    Task<BookingDto?> GetByIdAsync(Guid bookingId, Guid userId);
    Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId);
}