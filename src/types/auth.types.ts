export interface Usuario {
  id: number;
  nombreUsuario: string;
  correo: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
}
