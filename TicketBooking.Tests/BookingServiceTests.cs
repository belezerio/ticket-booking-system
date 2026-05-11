using Moq;
using FluentAssertions;
using TicketBooking.Core.DTOs;
using TicketBooking.Core.Entities;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Services;

namespace TicketBooking.Tests;

public class BookingServiceTests
{
    private readonly Mock<IBookingRepository> _mockBookingRepo;
    private readonly Mock<ISeatRepository> _mockSeatRepo;
    private readonly BookingService _service;

    public BookingServiceTests()
    {
        _mockBookingRepo = new Mock<IBookingRepository>();
        _mockSeatRepo = new Mock<ISeatRepository>();
        _service = new BookingService(_mockBookingRepo.Object, _mockSeatRepo.Object);
    }

    [Fact]
    public async Task CreateBooking_WhenSeatsUnavailable_ThrowsException()
    {
        // Arrange
        _mockSeatRepo
            .Setup(s => s.AreSeatsAvailableAsync(It.IsAny<Guid>(), It.IsAny<string[]>()))
            .ReturnsAsync(false);

        var dto = new CreateBookingDto(Guid.NewGuid(), "event", ["A1", "A2"]);

        // Act
        var act = async () => await _service.CreateBookingAsync(dto, Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*not available*");
    }

    [Fact]
    public async Task CreateBooking_WhenSeatsAvailable_ReturnsBookingDto()
    {
        // Arrange
        var referenceId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var dto = new CreateBookingDto(referenceId, "event", ["A1", "A2"]);

        _mockSeatRepo
            .Setup(s => s.AreSeatsAvailableAsync(referenceId, dto.SeatNumbers))
            .ReturnsAsync(true);

        _mockSeatRepo
            .Setup(s => s.GetPriceAsync(referenceId, "event"))
            .ReturnsAsync(500m);

        _mockBookingRepo
            .Setup(r => r.CreateAsync(It.IsAny<Booking>()))
            .ReturnsAsync((Booking b) => b);

        _mockSeatRepo
            .Setup(s => s.MarkSeatsBookedAsync(It.IsAny<Guid>(), It.IsAny<string[]>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.CreateBookingAsync(dto, userId);

        // Assert
        result.Should().NotBeNull();
        result.TotalAmount.Should().Be(1000m); // 500 x 2 seats
        result.Status.Should().Be("pending");
        result.UserId.Should().Be(userId);
    }

    [Fact]
    public async Task CancelBooking_WhenNotOwner_ThrowsUnauthorized()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(new Booking { Id = bookingId, UserId = ownerId, Status = "pending" });

        // Act
        var act = async () => await _service.CancelBookingAsync(bookingId, otherUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task CancelBooking_WhenAlreadyCancelled_ThrowsException()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(new Booking { Id = bookingId, UserId = userId, Status = "cancelled" });

        // Act
        var act = async () => await _service.CancelBookingAsync(bookingId, userId);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*already cancelled*");
    }

    [Fact]
    public async Task CancelBooking_WhenValid_ReturnsUpdatedBooking()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var booking = new Booking
        {
            Id = bookingId,
            UserId = userId,
            Status = "confirmed",
            SeatNumbers = ["A1"],
            ReferenceId = Guid.NewGuid()
        };

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(booking);

        _mockBookingRepo
            .Setup(r => r.UpdateStatusAsync(bookingId, "cancelled"))
            .ReturnsAsync(new Booking { Id = bookingId, UserId = userId, Status = "cancelled" });

        _mockSeatRepo
            .Setup(s => s.MarkSeatsAvailableAsync(It.IsAny<Guid>(), It.IsAny<string[]>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.CancelBookingAsync(bookingId, userId);

        // Assert
        result.Status.Should().Be("cancelled");
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotOwner_ReturnsNull()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var ownerId = Guid.NewGuid();

        _mockBookingRepo
            .Setup(r => r.GetByIdAsync(bookingId))
            .ReturnsAsync(new Booking { Id = bookingId, UserId = ownerId });

        // Act
        var result = await _service.GetByIdAsync(bookingId, Guid.NewGuid());

        // Assert
        result.Should().BeNull();
    }
}