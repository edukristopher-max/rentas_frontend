import api from '../lib/axios';
import { Deuda, CreateDeudaDto, UpdateDeudaDto } from '../types/deuda';

export const getDeudas = async (): Promise<Deuda[]> => {
  const response = await api.get('/Deudas');
  return response.data;
};

export const getDeuda = async (id: number): Promise<Deuda> => {
  const response = await api.get(`/Deudas/${id}`);
  return response.data;
};

export const createDeuda = async (data: CreateDeudaDto): Promise<Deuda> => {
  const response = await api.post('/Deudas', data);
  return response.data;
};

export const updateDeuda = async (id: number, data: UpdateDeudaDto): Promise<Deuda> => {
  const response = await api.put(`/Deudas/${id}`, data);
  return response.data;
};

export const deleteDeuda = async (id: number): Promise<void> => {
  await api.delete(`/Deudas/${id}`);
};
