export interface ArbitrioMunicipal {
  id: number;
  predioId: number;
  anioFiscal: number;
  periodo: string;
  montoLimpieza: number;
  montoParques: number;
  montoSerenazgo: number;
  montoTotal: number;
  fechaVencimiento: string;
  estadoPago: string;
  fechaPago?: string;
  predioCodigoCatastral?: string;
  predioDireccion?: string;
}

export interface CreateArbitrioMunicipalDto {
  predioId: number;
  anioFiscal: number;
  periodo: string;
  montoLimpieza: number;
  montoParques: number;
  montoSerenazgo: number;
  fechaVencimiento: string;
  estadoPago: string;
}

export interface UpdateArbitrioMunicipalDto extends CreateArbitrioMunicipalDto {
  fechaPago?: string;
}
