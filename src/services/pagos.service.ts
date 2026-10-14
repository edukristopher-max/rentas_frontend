import api from '../lib/axios';
import { Pago, CreatePagoDto } from '../types/pago';

export const getPagos = async (): Promise<Pago[]> => {
  const response = await api.get('/Pagos');
  return response.data;
};

export const getPago = async (id: number): Promise<Pago> => {
  const response = await api.get(`/Pagos/${id}`);
  return response.data;
};

export const createPago = async (data: CreatePagoDto): Promise<Pago> => {
  const response = await api.post('/Pagos', data);
  return response.data;
};
