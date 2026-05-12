using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Core.DTOs;
using TicketBooking.Core.Interfaces;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventRepository _eventRepo;

    public EventsController(IEventRepository eventRepo)
    {
        _eventRepo = eventRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var events = await _eventRepo.GetAllAsync();
        return Ok(events.Select(e => new EventDto(
            e.Id, e.Title, e.Description, e.Category,
            e.Venue, e.EventDate, e.TotalSeats,
            e.AvailableSeats, e.Price, e.ImageUrl, e.IsActive
        )));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var ev = await _eventRepo.GetByIdAsync(id);
        if (ev == null) return NotFound(new { error = "Event not found." });
        return Ok(new EventDto(
            ev.Id, ev.Title, ev.Description, ev.Category,
            ev.Venue, ev.EventDate, ev.TotalSeats,
            ev.AvailableSeats, ev.Price, ev.ImageUrl, ev.IsActive
        ));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateEventDto dto)
    {
        var ev = new Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Venue = dto.Venue,
            EventDate = dto.EventDate,
            TotalSeats = dto.TotalSeats,
            AvailableSeats = dto.TotalSeats,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _eventRepo.CreateAsync(ev);
        return CreatedAtAction(nameof(GetById), new { id = created.Id },
            new EventDto(created.Id, created.Title, created.Description,
                created.Category, created.Venue, created.EventDate,
                created.TotalSeats, created.AvailableSeats,
                created.Price, created.ImageUrl, created.IsActive));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ev = await _eventRepo.GetByIdAsync(id);
        if (ev == null) return NotFound(new { error = "Event not found." });
        await _eventRepo.DeleteAsync(id);
        return Ok(new { message = "Event deleted successfully." });
    }
}