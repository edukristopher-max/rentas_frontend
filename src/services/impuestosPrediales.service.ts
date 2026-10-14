import api from '../lib/axios';
import { ImpuestoPredial, CreateImpuestoPredialDto, UpdateImpuestoPredialDto } from '../types/impuestoPredial';

export const getImpuestosPrediales = async (): Promise<ImpuestoPredial[]> => {
  const response = await api.get('/ImpuestosPrediales');
  return response.data;
};

export const getImpuestoPredial = async (id: number): Promise<ImpuestoPredial> => {
  const response = await api.get(`/ImpuestosPrediales/${id}`);
  return response.data;
};

export const createImpuestoPredial = async (data: CreateImpuestoPredialDto): Promise<ImpuestoPredial> => {
  const response = await api.post('/ImpuestosPrediales', data);
  return response.data;
};

export const updateImpuestoPredial = async (id: number, data: UpdateImpuestoPredialDto): Promise<ImpuestoPredial> => {
  const response = await api.put(`/ImpuestosPrediales/${id}`, data);
  return response.data;
};

export const deleteImpuestoPredial = async (id: number): Promise<void> => {
  await api.delete(`/ImpuestosPrediales/${id}`);
};
