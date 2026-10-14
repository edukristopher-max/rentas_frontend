import api from '../lib/axios';
import { Configuracion, UpdateConfiguracionDto } from '../types/configuracion';

export const getConfiguracion = async (): Promise<Configuracion> => {
  const response = await api.get('/Configuraciones');
  return response.data;
};

export const updateConfiguracion = async (data: UpdateConfiguracionDto): Promise<Configuracion> => {
  const response = await api.put('/Configuraciones', data);
  return response.data;
};
