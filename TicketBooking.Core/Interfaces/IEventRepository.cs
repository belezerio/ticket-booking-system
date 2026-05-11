using TicketBooking.Core.Entities;

namespace TicketBooking.Core.Interfaces;

public interface IEventRepository
{
    Task<IEnumerable<Event>> GetAllAsync();
    Task<Event?> GetByIdAsync(Guid id);
    Task<Event> CreateAsync(Event ev);
    Task<Event> UpdateAsync(Event ev);
    Task<bool> DeleteAsync(Guid id);
}