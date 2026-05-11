using Microsoft.AspNetCore.Mvc;
using TicketBooking.Core.DTOs;
using TicketBooking.Infrastructure.Data;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SupabaseClientFactory _factory;

    public AuthController(SupabaseClientFactory factory)
    {
        _factory = factory;
    }
    [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequest req)
{
    var client = await _factory.GetAuthClientAsync();
    var session = await client.Auth.SignUp(req.Email, req.Password,
        new Supabase.Gotrue.SignUpOptions
        {
            Data = new Dictionary<string, object> { { "full_name", req.FullName } }
        });

    if (session?.User == null)
        return BadRequest(new { error = "Registration failed." });

    return Ok(new { session.User.Id, session.AccessToken });
}

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest req)
{
    var client = await _factory.GetAuthClientAsync();
    var session = await client.Auth.SignIn(req.Email, req.Password);

    if (session?.AccessToken == null)
        return Unauthorized(new { error = "Invalid credentials." });

    return Ok(new
    {
        session.AccessToken,
        session.RefreshToken,
        session.User?.Id,
        session.User?.Email
    });
}

[HttpPost("logout")]
public async Task<IActionResult> Logout()
{
    var client = await _factory.GetAuthClientAsync();
    await client.Auth.SignOut();
    return Ok(new { message = "Logged out successfully." });
}

   
}