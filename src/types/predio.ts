export interface Predio {
  id: number;
  codigoCatastral: string;
  direccion: string;
  areaTerreno: number;
  areaConstruida: number;
  usoPredio: string;
  valorArancelario: number;
  contribuyenteId: number;
  contribuyenteNombre?: string;
  contribuyenteDocumento?: string;
  estado: boolean;
}

export interface CreatePredioDto {
  codigoCatastral: string;
  direccion: string;
  areaTerreno: number;
  areaConstruida: number;
  usoPredio: string;
  valorArancelario: number;
  contribuyenteId: number;
}

export interface UpdatePredioDto extends CreatePredioDto {
  estado: boolean;
}
