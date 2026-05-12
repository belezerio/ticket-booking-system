import api from './axios';
import { Payment } from '../types';

export const initiatePayment = async (data: {
  bookingId: string;
  paymentMethod: string;
}): Promise<Payment> => {
  const res = await api.post('/payments', data);
  return res.data;
};