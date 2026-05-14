import api from './axios';
import { Route } from '../types';

export const getRoutes = async (): Promise<Route[]> => {
  const res = await api.get('/routes');
  return res.data;
};

export const getRouteById = async (id: string): Promise<Route> => {
  const res = await api.get(`/routes/${id}`);
  return res.data;
};

export const createRoute = async (data: Omit<Route, 'id'>): Promise<Route> => {
  const res = await api.post('/routes', data);
  return res.data;
};

export const updateRoute = async (id: string, data: Partial<Route>): Promise<Route> => {
  const res = await api.put(`/routes/${id}`, data);
  return res.data;
};

export const deleteRoute = async (id: string): Promise<void> => {
  await api.delete(`/routes/${id}`);
};