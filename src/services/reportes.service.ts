import api from '../lib/axios';
import { ReporteGenerado, CreateReporteGeneradoDto, DashboardMetrics } from '../types/reporte';

export const getMetricas = async (): Promise<DashboardMetrics> => {
  const response = await api.get('/Reportes/metricas');
  return response.data;
};

export const getHistorialReportes = async (): Promise<ReporteGenerado[]> => {
  const response = await api.get('/Reportes/historial');
  return response.data;
};

export const registrarReporte = async (data: CreateReporteGeneradoDto): Promise<ReporteGenerado> => {
  const response = await api.post('/Reportes/registrar', data);
  return response.data;
};
