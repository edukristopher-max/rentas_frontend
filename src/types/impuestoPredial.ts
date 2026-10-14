export interface ImpuestoPredial {
  id: number;
  predioId: number;
  anioFiscal: number;
  montoBase: number;
  impuestoCalculado: number;
  fechaVencimiento: string;
  estadoPago: string;
  fechaPago?: string;
  predioCodigoCatastral?: string;
  predioDireccion?: string;
}

export interface CreateImpuestoPredialDto {
  predioId: number;
  anioFiscal: number;
  montoBase: number;
  impuestoCalculado: number;
  fechaVencimiento: string;
  estadoPago: string;
}

export interface UpdateImpuestoPredialDto extends CreateImpuestoPredialDto {
  fechaPago?: string;
}
