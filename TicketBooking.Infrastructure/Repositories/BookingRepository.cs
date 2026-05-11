using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly SupabaseClientFactory _factory;

    public BookingRepository(SupabaseClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<Booking?> GetByIdAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Booking>()
            .Where(b => b.Id == id)
            .Single();
        return result;
    }

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Booking>()
            .Where(b => b.UserId == userId)
            .Get();
        return result.Models;
    }

    public async Task<Booking> CreateAsync(Booking booking)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Booking>()
            .Insert(booking);
        return result.Model!;
    }

    public async Task<Booking> UpdateStatusAsync(Guid id, string status)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Booking>()
            .Where(b => b.Id == id)
            .Set(b => b.Status, status)
            .Update();
        return result.Model!;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        await client
            .From<Booking>()
            .Where(b => b.Id == id)
            .Delete();
        return true;
    }
}