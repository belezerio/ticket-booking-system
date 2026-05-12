import api from './axios';
import { Event } from '../types';

export const getEvents = async (): Promise<Event[]> => {
  const res = await api.get('/events');
  return res.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};