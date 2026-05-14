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

export const createEvent = async (data: Omit<Event, 'id'>): Promise<Event> => {
  const res = await api.post('/events', data);
  return res.data;
};

export const updateEvent = async (id: string, data: Partial<Event>): Promise<Event> => {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};