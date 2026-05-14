import api from './axios';
import { Booking } from '../types';

export const createBooking = async (data: {
  referenceId: string;
  referenceType: string;
  seatNumbers: string[];
}): Promise<Booking> => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await api.get('/bookings');
  return res.data;
};

export const cancelBooking = async (id: string): Promise<Booking> => {
  const res = await api.post(`/bookings/${id}/cancel`);
  return res.data;
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await api.get('/bookings/all');
  return res.data;
};