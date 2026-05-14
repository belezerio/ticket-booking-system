# Use the .NET 10 SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project files and restore dependencies
COPY ["TicketBooking.API/TicketBooking.API.csproj", "TicketBooking.API/"]
COPY ["TicketBooking.Core/TicketBooking.Core.csproj", "TicketBooking.Core/"]
COPY ["TicketBooking.Infrastructure/TicketBooking.Infrastructure.csproj", "TicketBooking.Infrastructure/"]
RUN dotnet restore "TicketBooking.API/TicketBooking.API.csproj"

# Copy the remaining source code and build
COPY . .
WORKDIR "/src/TicketBooking.API"
RUN dotnet publish "TicketBooking.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port your application will listen on
EXPOSE 8080

ENTRYPOINT ["dotnet", "TicketBooking.API.dll"]
