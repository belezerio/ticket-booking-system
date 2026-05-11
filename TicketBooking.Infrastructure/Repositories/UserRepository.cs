using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SupabaseClientFactory _factory;

    public UserRepository(SupabaseClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<UserProfile?> GetByIdAsync(Guid id)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<UserProfile>()
            .Where(u => u.Id == id)
            .Single();
        return result;
    }

    public async Task<UserProfile> CreateAsync(UserProfile user)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<UserProfile>()
            .Insert(user);
        return result.Model!;
    }

    public async Task<UserProfile> UpdateAsync(UserProfile user)
    {
        var client = await _factory.GetClientAsync();
        var result = await client
            .From<UserProfile>()
            .Where(u => u.Id == user.Id)
            .Set(u => u.FullName, user.FullName)
            .Set(u => u.Phone, user.Phone)
            .Update();
        return result.Model!;
    }
}