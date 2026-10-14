import api from '../lib/axios';
import { Predio, CreatePredioDto, UpdatePredioDto } from '../types/predio';

export const getPredios = async (): Promise<Predio[]> => {
  const response = await api.get('/Predios');
  return response.data;
};

export const getPredio = async (id: number): Promise<Predio> => {
  const response = await api.get(`/Predios/${id}`);
  return response.data;
};

export const createPredio = async (data: CreatePredioDto): Promise<Predio> => {
  const response = await api.post('/Predios', data);
  return response.data;
};

export const updatePredio = async (id: number, data: UpdatePredioDto): Promise<Predio> => {
  const response = await api.put(`/Predios/${id}`, data);
  return response.data;
};

export const deletePredio = async (id: number): Promise<void> => {
  await api.delete(`/Predios/${id}`);
};
