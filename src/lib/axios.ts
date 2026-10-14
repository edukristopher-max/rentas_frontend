import axios from 'axios';

// Creamos una instancia de axios preconfigurada
const api = axios.create({
  // URL base de tu backend .NET (asegúrate de configurarla en tu .env o cámbiala por el puerto correcto)
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5134/api',
  
  // ¡MUY IMPORTANTE! Esta configuración permite que las cookies (donde estará el token JWT/Auth)
  // se envíen automáticamente en cada solicitud al servidor y se guarden al recibir la respuesta.
  withCredentials: true,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional: Interceptor para manejar errores globalmente (ej. si el token expiró)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Aquí puedes manejar la redirección al login o mostrar un mensaje
      console.log("Sesión expirada o no autorizada");
    }
    return Promise.reject(error);
  }
);

export default api;
