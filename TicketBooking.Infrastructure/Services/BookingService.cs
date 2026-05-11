using TicketBooking.Core.DTOs;
using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;

namespace TicketBooking.Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepo;
    private readonly ISeatRepository _seatRepo;

    public BookingService(IBookingRepository bookingRepo, ISeatRepository seatRepo)
    {
        _bookingRepo = bookingRepo;
        _seatRepo = seatRepo;
    }

    public async Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, Guid userId)
    {
        // BUSINESS RULE 1: Check seat availability
        var available = await _seatRepo.AreSeatsAvailableAsync(dto.ReferenceId, dto.SeatNumbers);
        if (!available)
            throw new InvalidOperationException("One or more seats are not available.");

        // BUSINESS RULE 2: Calculate total amount
        var price = await _seatRepo.GetPriceAsync(dto.ReferenceId, dto.ReferenceType);
        var total = price * dto.SeatNumbers.Length;

        // BUSINESS RULE 3: Create booking
        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ReferenceId = dto.ReferenceId,
            ReferenceType = dto.ReferenceType,
            SeatNumbers = dto.SeatNumbers,
            TotalAmount = total,
            Status = "pending",
            BookingDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _bookingRepo.CreateAsync(booking);

        // BUSINESS RULE 4: Mark seats as booked
        await _seatRepo.MarkSeatsBookedAsync(dto.ReferenceId, dto.SeatNumbers);

        return MapToDto(created);
    }

    public async Task<BookingDto> CancelBookingAsync(Guid bookingId, Guid userId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId)
            ?? throw new KeyNotFoundException("Booking not found.");

        // BUSINESS RULE: Only owner can cancel
        if (booking.UserId != userId)
            throw new UnauthorizedAccessException("You can only cancel your own bookings.");

        // BUSINESS RULE: Only pending or confirmed bookings can be cancelled
        if (booking.Status == "cancelled" || booking.Status == "refunded")
            throw new InvalidOperationException("Booking is already cancelled or refunded.");

        var updated = await _bookingRepo.UpdateStatusAsync(bookingId, "cancelled");

        // Free up the seats
        await _seatRepo.MarkSeatsAvailableAsync(booking.ReferenceId, booking.SeatNumbers);

        return MapToDto(updated);
    }

    public async Task<BookingDto?> GetByIdAsync(Guid bookingId, Guid userId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId);
        if (booking == null || booking.UserId != userId) return null;
        return MapToDto(booking);
    }

    public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId)
    {
        var bookings = await _bookingRepo.GetByUserIdAsync(userId);
        return bookings.Select(MapToDto);
    }

    private static BookingDto MapToDto(Booking b) => new(
        b.Id, b.UserId, b.ReferenceId, b.ReferenceType,
        b.SeatNumbers, b.TotalAmount, b.Status,
        b.BookingDate, b.CancellationDate
    );
}