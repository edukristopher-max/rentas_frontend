export interface Contribuyente {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompletoRazonSocial: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: boolean;
}

export interface CreateContribuyenteDto {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompletoRazonSocial: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface UpdateContribuyenteDto extends CreateContribuyenteDto {
  estado: boolean;
}
