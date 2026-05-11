using TicketBooking.Core.Entities;

namespace TicketBooking.Core.Interfaces;

public interface ISeatRepository
{
    Task<IEnumerable<Seat>> GetByReferenceAsync(Guid referenceId, string referenceType);
    Task<bool> AreSeatsAvailableAsync(Guid referenceId, string[] seatNumbers);
    Task MarkSeatsBookedAsync(Guid referenceId, string[] seatNumbers);
    Task MarkSeatsAvailableAsync(Guid referenceId, string[] seatNumbers);
    Task<decimal> GetPriceAsync(Guid referenceId, string referenceType);
}