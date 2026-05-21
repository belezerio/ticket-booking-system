# 🎟️ Ticket Booking System

A modern **Ticket Booking System** built to simplify ticket reservations, booking management, and user authentication. This application allows users to browse events, book tickets, manage reservations, and securely handle payments.

---

## 🚀 Features

### 👤 User Features
- User Registration & Login
- Secure Authentication & Authorization
- Browse Available Events / Tickets
- Search & Filter Events
- Book Tickets Online
- View Booking History
- Cancel Bookings
- Responsive UI

### 🛠️ Admin Features
- Manage Events
- Add / Update / Delete Events
- Manage Ticket Availability
- View User Bookings
- Dashboard Analytics

### 🔒 Security Features
- JWT Authentication
- Role-Based Access Control
- Protected APIs
- Input Validation

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Bootstrap / CSS
- Axios
- React Router

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- C#

### Database
- SQL Server

### Authentication
- JWT Token Authentication

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | User Login |

### Events

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/events | Get Events |
| POST | /api/events | Create Event |
| PUT | /api/events/{id} | Update Event |
| DELETE | /api/events/{id} | Delete Event |

### Bookings

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/bookings | Book Ticket |
| GET | /api/bookings | Get User Bookings |
| DELETE | /api/bookings/{id} | Cancel Booking |

---

## Future Enhancements

- Payment Gateway Integration
- Email Notifications
- QR Code Tickets
- Seat Selection System
- Real-time Availability Tracking
- Docker Deployment

