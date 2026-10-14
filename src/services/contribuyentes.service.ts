import api from '../lib/axios';
import { Contribuyente, CreateContribuyenteDto, UpdateContribuyenteDto } from '../types/contribuyente';

export const getContribuyentes = async (): Promise<Contribuyente[]> => {
  const response = await api.get('/Contribuyentes');
  return response.data;
};

export const getContribuyente = async (id: number): Promise<Contribuyente> => {
  const response = await api.get(`/Contribuyentes/${id}`);
  return response.data;
};

export const createContribuyente = async (data: CreateContribuyenteDto): Promise<Contribuyente> => {
  const response = await api.post('/Contribuyentes', data);
  return response.data;
};

export const updateContribuyente = async (id: number, data: UpdateContribuyenteDto): Promise<Contribuyente> => {
  const response = await api.put(`/Contribuyentes/${id}`, data);
  return response.data;
};

export const deleteContribuyente = async (id: number): Promise<void> => {
  await api.delete(`/Contribuyentes/${id}`);
};
