import api from '../lib/axios';
import { DashboardMetrics } from '../types/reporte';
import { ActividadReciente, CreateActividadRecienteDto } from '../types/actividad';

export const getDashboardMetricas = async (): Promise<DashboardMetrics> => {
  const response = await api.get('/Dashboard/metricas');
  return response.data;
};

export const getActividades = async (): Promise<ActividadReciente[]> => {
  const response = await api.get('/Dashboard/actividades');
  return response.data;
};

export const registrarActividad = async (data: CreateActividadRecienteDto): Promise<ActividadReciente> => {
  const response = await api.post('/Dashboard/actividades', data);
  return response.data;
};

export const getMonthlyChart = async (): Promise<any[]> => {
  const response = await api.get('/Dashboard/charts/monthly');
  return response.data;
};

export const getTypesChart = async (): Promise<any[]> => {
  const response = await api.get('/Dashboard/charts/types');
  return response.data;
};
