using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Core.DTOs;
using TicketBooking.Core.Interfaces;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value
            ?? throw new UnauthorizedAccessException("User not found in token."));

    [HttpPost]
    public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentDto dto)
    {
        var payment = await _paymentService.ProcessPaymentAsync(dto, GetUserId());
        return Ok(payment);
    }

    [HttpGet("{bookingId}")]
    public async Task<IActionResult> GetPaymentStatus(Guid bookingId)
    {
        var payment = await _paymentService.GetByBookingIdAsync(bookingId);
        if (payment == null) return NotFound(new { error = "Payment not found." });
        return Ok(payment);
    }

    [HttpPost("{id}/refund")]
    public async Task<IActionResult> RequestRefund(Guid id)
    {
        var result = await _paymentService.ProcessRefundAsync(id, GetUserId());
        return Ok(result);
    }
}