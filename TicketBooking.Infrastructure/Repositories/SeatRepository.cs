using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.Infrastructure.Repositories;

public class SeatRepository : ISeatRepository
{
    private readonly SupabaseClientFactory _factory;

    public SeatRepository(SupabaseClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<Seat>> GetByReferenceAsync(Guid referenceId, string referenceType)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Seat>()
            .Where(s => s.ReferenceId == referenceId && s.ReferenceType == referenceType)
            .Get();
        return result.Models;
    }

    public async Task<bool> AreSeatsAvailableAsync(Guid referenceId, string[] seatNumbers)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<Seat>()
            .Where(s => s.ReferenceId == referenceId && s.IsBooked == false)
            .Get();

        var availableSeats = result.Models.Select(s => s.SeatNumber).ToHashSet();
        return seatNumbers.All(s => availableSeats.Contains(s));
    }

    public async Task MarkSeatsBookedAsync(Guid referenceId, string[] seatNumbers)
    {
        var client = await _factory.GetClientAsync();
        foreach (var seatNumber in seatNumbers)
        {
            await client
                .From<Seat>()
                .Where(s => s.ReferenceId == referenceId && s.SeatNumber == seatNumber)
                .Set(s => s.IsBooked, true)
                .Update();
        }
    }

    public async Task MarkSeatsAvailableAsync(Guid referenceId, string[] seatNumbers)
    {
        var client = await _factory.GetClientAsync();
        foreach (var seatNumber in seatNumbers)
        {
            await client
                .From<Seat>()
                .Where(s => s.ReferenceId == referenceId && s.SeatNumber == seatNumber)
                .Set(s => s.IsBooked, false)
                .Update();
        }
    }

    public async Task<decimal> GetPriceAsync(Guid referenceId, string referenceType)
    {
        var client = await _factory.GetClientAsync();

        if (referenceType == "event")
        {
            var result = await client
                .From<Event>()
                .Where(e => e.Id == referenceId)
                .Single();
            return result?.Price ?? 0;
        }
        else
        {
            var result = await client
                .From<Core.Entities.Route>()
                .Where(r => r.Id == referenceId)
                .Single();
            return result?.Price ?? 0;
        }
    }
}