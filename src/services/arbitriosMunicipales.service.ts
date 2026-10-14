import api from '../lib/axios';
import { ArbitrioMunicipal, CreateArbitrioMunicipalDto, UpdateArbitrioMunicipalDto } from '../types/arbitrioMunicipal';

export const getArbitriosMunicipales = async (): Promise<ArbitrioMunicipal[]> => {
  const response = await api.get('/ArbitriosMunicipales');
  return response.data;
};

export const getArbitrioMunicipal = async (id: number): Promise<ArbitrioMunicipal> => {
  const response = await api.get(`/ArbitriosMunicipales/${id}`);
  return response.data;
};

export const createArbitrioMunicipal = async (data: CreateArbitrioMunicipalDto): Promise<ArbitrioMunicipal> => {
  const response = await api.post('/ArbitriosMunicipales', data);
  return response.data;
};

export const updateArbitrioMunicipal = async (id: number, data: UpdateArbitrioMunicipalDto): Promise<ArbitrioMunicipal> => {
  const response = await api.put(`/ArbitriosMunicipales/${id}`, data);
  return response.data;
};

export const deleteArbitrioMunicipal = async (id: number): Promise<void> => {
  await api.delete(`/ArbitriosMunicipales/${id}`);
};
