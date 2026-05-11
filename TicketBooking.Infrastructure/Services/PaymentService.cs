using TicketBooking.Core.DTOs;
using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;

namespace TicketBooking.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IBookingRepository _bookingRepo;

    public PaymentService(IPaymentRepository paymentRepo, IBookingRepository bookingRepo)
    {
        _paymentRepo = paymentRepo;
        _bookingRepo = bookingRepo;
    }

    public async Task<PaymentDto> ProcessPaymentAsync(InitiatePaymentDto dto, Guid userId)
    {
        var booking = await _bookingRepo.GetByIdAsync(dto.BookingId)
            ?? throw new KeyNotFoundException("Booking not found.");

        // BUSINESS RULE: Only booking owner can pay
        if (booking.UserId != userId)
            throw new UnauthorizedAccessException("You can only pay for your own bookings.");

        // BUSINESS RULE: Only pending bookings can be paid
        if (booking.Status != "pending")
            throw new InvalidOperationException("Only pending bookings can be paid.");

        // Create payment record (mock - in production call Stripe/Razorpay here)
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            BookingId = dto.BookingId,
            Amount = booking.TotalAmount,
            Status = "completed",
            PaymentMethod = dto.PaymentMethod,
            TransactionId = $"TXN{DateTime.UtcNow.Ticks}",
            PaidAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _paymentRepo.CreateAsync(payment);

        // Update booking status to confirmed
        await _bookingRepo.UpdateStatusAsync(dto.BookingId, "confirmed");

        return MapToDto(created);
    }

    public async Task<PaymentDto?> GetByBookingIdAsync(Guid bookingId)
    {
        var payment = await _paymentRepo.GetByBookingIdAsync(bookingId);
        return payment == null ? null : MapToDto(payment);
    }

    public async Task<PaymentDto> ProcessRefundAsync(Guid paymentId, Guid userId)
    {
        var payment = await _paymentRepo.GetByIdAsync(paymentId)
            ?? throw new KeyNotFoundException("Payment not found.");

        var booking = await _bookingRepo.GetByIdAsync(payment.BookingId)
            ?? throw new KeyNotFoundException("Booking not found.");

        // BUSINESS RULE: Only booking owner can request refund
        if (booking.UserId != userId)
            throw new UnauthorizedAccessException("You can only refund your own payments.");

        // BUSINESS RULE: Only completed payments can be refunded
        if (payment.Status != "completed")
            throw new InvalidOperationException("Only completed payments can be refunded.");

        var updated = await _paymentRepo.UpdateStatusAsync(paymentId, "refunded");
        await _bookingRepo.UpdateStatusAsync(payment.BookingId, "refunded");

        return MapToDto(updated);
    }

    private static PaymentDto MapToDto(Payment p) => new(
        p.Id, p.BookingId, p.Amount, p.Status,
        p.PaymentMethod, p.TransactionId, p.PaidAt
    );
}