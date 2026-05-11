using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Core.DTOs;
using TicketBooking.Core.Interfaces;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepo;

    public UsersController(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value
            ?? throw new UnauthorizedAccessException("User not found in token."));

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userRepo.GetByIdAsync(GetUserId());
        if (user == null) return NotFound(new { error = "Profile not found." });

        return Ok(new UserDto(user.Id, user.FullName, user.Phone, user.Role));
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var user = await _userRepo.GetByIdAsync(GetUserId());
        if (user == null) return NotFound(new { error = "Profile not found." });

        user.FullName = dto.FullName;
        user.Phone = dto.Phone;

        var updated = await _userRepo.UpdateAsync(user);
        return Ok(new UserDto(updated.Id, updated.FullName, updated.Phone, updated.Role));
    }
}