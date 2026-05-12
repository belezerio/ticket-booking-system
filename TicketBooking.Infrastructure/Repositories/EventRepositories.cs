using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly SupabaseClientFactory _factory;

    public EventRepository(SupabaseClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<Event>> GetAllAsync()
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Event>().Get();
        return result.Models;
    }

    public async Task<Event?> GetByIdAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Event>().Where(e => e.Id == id).Single();
        return result;
    }

    public async Task<Event> CreateAsync(Event ev)
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Event>().Insert(ev);
        return result.Model!;
    }

    public async Task<Event> UpdateAsync(Event ev)
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Event>().Where(e => e.Id == ev.Id).Update(ev);
        return result.Model!;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        await client.From<Event>().Where(e => e.Id == id).Delete();
        return true;
    }
}