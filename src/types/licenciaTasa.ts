export interface LicenciaTasa {
  id: number;
  contribuyenteId: number;
  predioId?: number | null;
  tipo: string;
  numeroExpediente: string;
  concepto: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento?: string | null;
  estado: string;
  contribuyenteNombre?: string;
  predioDireccion?: string;
}

export interface CreateLicenciaTasaDto {
  contribuyenteId: number;
  predioId?: number | null;
  tipo: string;
  numeroExpediente: string;
  concepto: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento?: string | null;
  estado: string;
}

export interface UpdateLicenciaTasaDto extends CreateLicenciaTasaDto {
}
