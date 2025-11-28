import axios from 'axios';
import { getTokens, setTokens, clearTokens } from './tokenStore';
import { decodeToken } from './jwtUtils';

// Usar la URL pública del backend por defecto. Normalizamos para que SIEMPRE
// termine en `/api` y evitar inconsistencias entre entornos (con o sin `/api`).
const rawBase = process.env.EXPO_PUBLIC_API_URL ?? 'https://waldoz-001-site1.stempurl.com/api';
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : rawBase.replace(/\/$/, '') + '/api';

// Configurar axios con la URL base estandarizada
axios.defaults.baseURL = API_BASE_URL;

// Interceptor de request: Agregar token automáticamente si existe
axios.interceptors.request.use(
  async (config) => {
    const { token } = await getTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: Manejar 401 y refrescar token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { token, refreshToken } = await getTokens();

        if (!token) {
          throw new Error('No access token available');
        }

        const user = decodeToken(token);
        const email = user?.email;

        if (refreshToken && email) {
          // Llamar al endpoint de refresh
          const response = await axios.post('/account/refresh-token', {
            email,
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          // Guardar nuevos tokens
          await setTokens({ token: newToken, refreshToken: newRefreshToken });

          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir a login
        await clearTokens();
        // Aquí podrías emitir un evento o usar un contexto para redirigir
      }
    }

    return Promise.reject(error);
  }
);

export default axios;