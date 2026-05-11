using Moq;
using FluentAssertions;
using TicketBooking.Core.DTOs;
using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Services;

namespace TicketBooking.Tests;

public class PaymentServiceTests
{
    private readonly Mock<IPaymentRepository> _mockPaymentRepo;
    private readonly Mock<IBookingRepository> _mockBookingRepo;
    private readonly PaymentService _service;

    public PaymentServiceTests()
    {
        _mockPaymentRepo = new Mock<IPaymentRepository>();
        _mockBookingRepo = new Mock<IBookingRepository>();
        _service = new PaymentService(_mockPaymentRepo.Object, _mockBookingRepo.Object);
    }

    [Fact]
    public async Task ProcessPayment_WhenBookingNotPending_ThrowsException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var bookingId = Guid.NewGuid();

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(new Booking { Id = bookingId, UserId = userId, Status = "confirmed" });

        var dto = new InitiatePaymentDto(bookingId, "card");

        // Act
        var act = async () => await _service.ProcessPaymentAsync(dto, userId);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*pending*");
    }

    [Fact]
    public async Task ProcessPayment_WhenNotOwner_ThrowsUnauthorized()
    {
        // Arrange
        var bookingId = Guid.NewGuid();

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(new Booking { Id = bookingId, UserId = Guid.NewGuid(), Status = "pending" });

        var dto = new InitiatePaymentDto(bookingId, "card");

        // Act
        var act = async () => await _service.ProcessPaymentAsync(dto, Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task ProcessPayment_WhenValid_ReturnsCompletedPayment()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var bookingId = Guid.NewGuid();

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(new Booking
            {
                Id = bookingId, UserId = userId,
                Status = "pending", TotalAmount = 1000m
            });

        _mockPaymentRepo
            .Setup(r => r.CreateAsync(It.IsAny<Payment>()))
            .ReturnsAsync((Payment p) => p);

        _mockBookingRepo
            .Setup(r => r.UpdateStatusAsync(bookingId, "confirmed"))
            .ReturnsAsync(new Booking { Id = bookingId, Status = "confirmed" });

        var dto = new InitiatePaymentDto(bookingId, "card");

        // Act
        var result = await _service.ProcessPaymentAsync(dto, userId);

        // Assert
        result.Should().NotBeNull();
        result.Status.Should().Be("completed");
        result.Amount.Should().Be(1000m);
    }
}