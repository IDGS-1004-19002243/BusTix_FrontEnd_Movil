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
    console.log('🔵 API INTERCEPTOR - REQUEST');
    console.log('─────────────────────────────────────');
    console.log('🌐 URL completa:', `${config.baseURL}${config.url}`);
    console.log('📡 Método:', config.method?.toUpperCase());
    console.log('📦 Data:', config.data ? JSON.stringify(config.data, null, 2) : 'No data');
    
    const { token } = await getTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado:', token.substring(0, 20) + '...');
      
      // Decodificar y mostrar info del token
      try {
        const decoded = decodeToken(token);
        console.log('👤 Usuario del token:', decoded?.email);
        console.log('🎭 Roles:', decoded?.role);
        console.log('⏰ Expira:', decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : 'N/A');
      } catch (e) {
        console.log('⚠️ No se pudo decodificar token');
      }
    } else {
      console.log('⚠️ No hay token disponible');
    }
    console.log('─────────────────────────────────────\n');
    
    return config;
  },
  (error) => {
    console.log('❌ ERROR en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response: Manejar 401 y refrescar token
axios.interceptors.response.use(
  (response) => {
    console.log('✅ API INTERCEPTOR - RESPONSE SUCCESS');
    console.log('─────────────────────────────────────');
    console.log('🌐 URL:', response.config.url);
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📦 Data:', JSON.stringify(response.data, null, 2).substring(0, 500));
    console.log('─────────────────────────────────────\n');
    return response;
  },
  async (error) => {
    console.log('❌ API INTERCEPTOR - RESPONSE ERROR');
    console.log('─────────────────────────────────────');
    console.log('🌐 URL:', error.config?.url);
    console.log('📊 Status:', error.response?.status);
    console.log('💬 Status Text:', error.response?.statusText);
    console.log('📦 Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('🔴 Error Message:', error.message);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Intentando refrescar token (401 detected)...');
      originalRequest._retry = true;

      try {
        const { token, refreshToken } = await getTokens();

        if (!token) {
          console.log('❌ No hay access token disponible');
          throw new Error('No access token available');
        }

        const user = decodeToken(token);
        const email = user?.email;
        
        console.log('📧 Email del usuario:', email);
        console.log('🔄 RefreshToken disponible:', !!refreshToken);

        if (refreshToken && email) {
          console.log('⏳ Llamando a /account/refresh-token...');
          
          // Llamar al endpoint de refresh
          const response = await axios.post('/account/refresh-token', {
            email,
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          
          console.log('✅ Nuevos tokens obtenidos');
          console.log('🔑 Nuevo token:', newToken.substring(0, 20) + '...');

          // Guardar nuevos tokens
          await setTokens({ token: newToken, refreshToken: newRefreshToken });

          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('🔄 Reintentando petición original...');
          return axios(originalRequest);
        }
      } catch (refreshError: any) {
        console.log('❌ ERROR al refrescar token:', refreshError?.message);
        console.log('🗑️ Limpiando tokens...');
        
        // Si falla el refresh, limpiar tokens y redirigir a login
        await clearTokens();
        // Aquí podrías emitir un evento o usar un contexto para redirigir
      }
    }
    
    console.log('─────────────────────────────────────\n');

    return Promise.reject(error);
  }
);

export default axios;