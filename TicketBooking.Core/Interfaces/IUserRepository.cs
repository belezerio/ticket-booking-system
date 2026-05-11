using TicketBooking.Core.Entities;

namespace TicketBooking.Core.Interfaces;

public interface IUserRepository
{
    Task<UserProfile?> GetByIdAsync(Guid id);
    Task<UserProfile> CreateAsync(UserProfile user);
    Task<UserProfile> UpdateAsync(UserProfile user);
}