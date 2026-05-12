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