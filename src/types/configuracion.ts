export interface Configuracion {
  id: number;
  nombreMunicipalidad: string;
  ruc: string;
  direccion: string;
  telefono: string;
  emailContacto: string;
  tasaInteresMoratorio: number;
  uitActual: number;
  moneda: string;
}

export interface UpdateConfiguracionDto {
  nombreMunicipalidad: string;
  ruc: string;
  direccion: string;
  telefono: string;
  emailContacto: string;
  tasaInteresMoratorio: number;
  uitActual: number;
  moneda: string;
}
