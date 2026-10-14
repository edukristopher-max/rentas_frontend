export interface Notificacion {
  id: number;
  contribuyenteId: number;
  tipo: string;
  medioEnvio: string;
  titulo: string;
  mensaje: string;
  fechaEnvio: string;
  estado: string;
  contribuyenteNombre?: string;
}

export interface CreateNotificacionDto {
  contribuyenteId: number;
  tipo: string;
  medioEnvio: string;
  titulo: string;
  mensaje: string;
}

export interface UpdateNotificacionDto extends CreateNotificacionDto {
  estado: string;
}
