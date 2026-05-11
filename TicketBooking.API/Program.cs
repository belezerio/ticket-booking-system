using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using TicketBooking.Core.Interfaces;
using TicketBooking.Infrastructure.Data;
using TicketBooking.Infrastructure.Repositories;
using TicketBooking.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Supabase
builder.Services.AddSingleton<SupabaseClientFactory>(_ =>
    new SupabaseClientFactory(
        builder.Configuration["Supabase:Url"]!,
        builder.Configuration["Supabase:AnonKey"]!,
        builder.Configuration["Supabase:ServiceKey"]!
    ));

// Repositories
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ISeatRepository, SeatRepository>();
// JWT Authentication
// JWT Authentication - Supabase uses ES256 (asymmetric)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = false,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            SignatureValidator = (token, parameters) =>
            {
                var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(token);
                return jwt;
            }
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Built-in .NET 10 OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<TicketBooking.API.Middleware.ExceptionMiddleware>();
app.MapOpenApi();
app.MapScalarApiReference();
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();