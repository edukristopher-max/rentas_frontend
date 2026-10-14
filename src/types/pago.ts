export interface Pago {
  id: number;
  deudaId: number;
  numeroRecibo: string;
  fechaPago: string;
  montoPagado: number;
  metodoPago: string;
  cajero: string;
  notas: string;
  deudaConcepto?: string;
  contribuyenteNombre?: string;
}

export interface CreatePagoDto {
  deudaId: number;
  montoPagado: number;
  metodoPago: string;
  cajero: string;
  notas: string;
}
