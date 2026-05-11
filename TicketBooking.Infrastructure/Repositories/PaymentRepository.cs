using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly SupabaseClientFactory _factory;

    public PaymentRepository(SupabaseClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<Payment?> GetByIdAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Payment>()
            .Where(p => p.Id == id)
            .Single();
        return result;
    }

    public async Task<Payment?> GetByBookingIdAsync(Guid bookingId)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Payment>()
            .Where(p => p.BookingId == bookingId)
            .Single();
        return result;
    }

    public async Task<Payment> CreateAsync(Payment payment)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Payment>()
            .Insert(payment);
        return result.Model!;
    }

    public async Task<Payment> UpdateStatusAsync(Guid id, string status)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Payment>()
            .Where(p => p.Id == id)
            .Set(p => p.Status, status)
            .Update();
        return result.Model!;
    }
}