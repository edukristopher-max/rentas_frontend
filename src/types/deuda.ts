export interface Deuda {
  id: number;
  contribuyenteId: number;
  predioId?: number | null;
  concepto: string;
  tipoDeuda: string;
  montoOriginal: number;
  mora: number;
  descuento: number;
  totalPagar: number;
  fechaVencimiento: string;
  estado: string;
  contribuyenteNombre?: string;
  predioDireccion?: string;
}

export interface CreateDeudaDto {
  contribuyenteId: number;
  predioId?: number | null;
  concepto: string;
  tipoDeuda: string;
  montoOriginal: number;
  mora: number;
  descuento: number;
  fechaVencimiento: string;
  estado: string;
}

export interface UpdateDeudaDto extends CreateDeudaDto {
}
