import api from '../lib/axios';
import { Notificacion, CreateNotificacionDto, UpdateNotificacionDto } from '../types/notificacion';

export const getNotificaciones = async (): Promise<Notificacion[]> => {
  const response = await api.get('/Notificaciones');
  return response.data;
};

export const getNotificacion = async (id: number): Promise<Notificacion> => {
  const response = await api.get(`/Notificaciones/${id}`);
  return response.data;
};

export const createNotificacion = async (data: CreateNotificacionDto): Promise<Notificacion> => {
  const response = await api.post('/Notificaciones', data);
  return response.data;
};

export const updateNotificacion = async (id: number, data: UpdateNotificacionDto): Promise<Notificacion> => {
  const response = await api.put(`/Notificaciones/${id}`, data);
  return response.data;
};

export const deleteNotificacion = async (id: number): Promise<void> => {
  await api.delete(`/Notificaciones/${id}`);
};
