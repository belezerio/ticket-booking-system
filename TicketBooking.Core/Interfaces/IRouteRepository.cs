using TicketBooking.Core.Entities;

namespace TicketBooking.Core.Interfaces;

public interface IRouteRepository
{
    Task<IEnumerable<Entities.Route>> GetAllAsync();
    Task<Entities.Route?> GetByIdAsync(Guid id);
    Task<Entities.Route> CreateAsync(Entities.Route route);
    Task<Entities.Route> UpdateAsync(Entities.Route route);
    Task<bool> DeleteAsync(Guid id);
}