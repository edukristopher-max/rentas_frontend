import api from '../lib/axios';
import { LicenciaTasa, CreateLicenciaTasaDto, UpdateLicenciaTasaDto } from '../types/licenciaTasa';

export const getLicenciasTasas = async (): Promise<LicenciaTasa[]> => {
  const response = await api.get('/LicenciasTasas');
  return response.data;
};

export const getLicenciaTasa = async (id: number): Promise<LicenciaTasa> => {
  const response = await api.get(`/LicenciasTasas/${id}`);
  return response.data;
};

export const createLicenciaTasa = async (data: CreateLicenciaTasaDto): Promise<LicenciaTasa> => {
  const response = await api.post('/LicenciasTasas', data);
  return response.data;
};

export const updateLicenciaTasa = async (id: number, data: UpdateLicenciaTasaDto): Promise<LicenciaTasa> => {
  const response = await api.put(`/LicenciasTasas/${id}`, data);
  return response.data;
};

export const deleteLicenciaTasa = async (id: number): Promise<void> => {
  await api.delete(`/LicenciasTasas/${id}`);
};
