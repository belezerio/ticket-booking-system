using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Core.DTOs;
using TicketBooking.Core.Interfaces;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IRouteRepository _routeRepo;

    public RoutesController(IRouteRepository routeRepo)
    {
        _routeRepo = routeRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var routes = await _routeRepo.GetAllAsync();
        return Ok(routes.Select(r => new RouteDto(
            r.Id, r.Type, r.Operator, r.Source,
            r.Destination, r.DepartureTime, r.ArrivalTime,
            r.TotalSeats, r.AvailableSeats, r.Price, r.IsActive
        )));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var route = await _routeRepo.GetByIdAsync(id);
        if (route == null) return NotFound(new { error = "Route not found." });
        return Ok(new RouteDto(
            route.Id, route.Type, route.Operator, route.Source,
            route.Destination, route.DepartureTime, route.ArrivalTime,
            route.TotalSeats, route.AvailableSeats, route.Price, route.IsActive
        ));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateRouteDto dto)
    {
        var route = new Core.Entities.Route
        {
            Id = Guid.NewGuid(),
            Type = dto.Type,
            Operator = dto.Operator,
            Source = dto.Source,
            Destination = dto.Destination,
            DepartureTime = dto.DepartureTime,
            ArrivalTime = dto.ArrivalTime,
            TotalSeats = dto.TotalSeats,
            AvailableSeats = dto.TotalSeats,
            Price = dto.Price,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _routeRepo.CreateAsync(route);
        return CreatedAtAction(nameof(GetById), new { id = created.Id },
            new RouteDto(created.Id, created.Type, created.Operator,
                created.Source, created.Destination, created.DepartureTime,
                created.ArrivalTime, created.TotalSeats,
                created.AvailableSeats, created.Price, created.IsActive));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var route = await _routeRepo.GetByIdAsync(id);
        if (route == null) return NotFound(new { error = "Route not found." });
        await _routeRepo.DeleteAsync(id);
        return Ok(new { message = "Route deleted successfully." });
    }
}