using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.Infrastructure.Repositories;

public class RouteRepository : IRouteRepository
{
    private readonly SupabaseClientFactory _factory;

    public RouteRepository(SupabaseClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<Core.Entities.Route>> GetAllAsync()
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Core.Entities.Route>().Get();
        return result.Models;
    }

    public async Task<Core.Entities.Route?> GetByIdAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Core.Entities.Route>()
            .Where(r => r.Id == id).Single();
        return result;
    }

    public async Task<Core.Entities.Route> CreateAsync(Core.Entities.Route route)
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Core.Entities.Route>().Insert(route);
        return result.Model!;
    }

    public async Task<Core.Entities.Route> UpdateAsync(Core.Entities.Route route)
    {
        var client = await _factory.GetClientAsync();
        var result = await client.From<Core.Entities.Route>()
            .Where(r => r.Id == route.Id).Update(route);
        return result.Model!;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        await client.From<Core.Entities.Route>().Where(r => r.Id == id).Delete();
        return true;
    }
}