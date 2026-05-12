export interface User {
  id: string;
  fullName: string;
  phone: string | null;
  role: 'customer' | 'admin';
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category: 'movie' | 'concert' | 'sports' | 'other';
  venue: string;
  eventDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface Route {
  id: string;
  type: 'bus' | 'train' | 'flight';
  operator: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  isActive: boolean;
}

export interface Seat {
  id: string;
  referenceId: string;
  referenceType: string;
  seatNumber: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  referenceId: string;
  referenceType: string;
  seatNumbers: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  bookingDate: string;
  cancellationDate: string | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string | null;
  paidAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
}