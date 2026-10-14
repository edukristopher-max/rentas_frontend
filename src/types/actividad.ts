export interface ActividadReciente {
  id: number;
  modulo: string;
  accion: string;
  fecha: string;
  usuario: string;
}

export interface CreateActividadRecienteDto {
  modulo: string;
  accion: string;
}
