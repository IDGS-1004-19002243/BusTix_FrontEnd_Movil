import axios from './interceptors'; // Importa axios configurado con interceptores
import { setTokens, clearTokens, getRefreshToken, getTokens } from './tokenStore';
import { decodeToken } from './jwtUtils';
import {
  AuthResponseDto,
  RefreshTokenDto,
  LoginDto,
  RegisterDto
} from './auth.types';
import { categorizeError, ErrorType, ApiError } from '../api-errors';

export async function apiLogin(loginDto: LoginDto): Promise<AuthResponseDto> {
  try {
    const response = await axios.post<AuthResponseDto>('/account/login', loginDto);
    const data = response.data;

    console.log('📋 Respuesta de login del backend:', data);

    if (data.isSuccess) {
      // Guardar tokens
      await setTokens({ token: data.token, refreshToken: data.refreshToken });
    } else {
      // El backend devolvió isSuccess: false, convertirlo en error categorizado
      const clientError: ApiError = {
        type: ErrorType.CLIENT_ERROR,
        message: data.message || 'Error en el inicio de sesión',
        statusCode: 400, // Asumir error del cliente
        originalError: { response: { data, status: 400 } }
      };
      throw clientError;
    }

    return data;
  } catch (error: any) {
    // Si ya es un ApiError (de arriba), relanzarlo
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }

    // Categorizar el error y lanzar el error estructurado
    const categorizedError = categorizeError(error);
    console.log(`📋 Error categorizado: ${categorizedError.type} - ${categorizedError.message}`);

    throw categorizedError;
  }
}

export async function apiRegister(registerDto: RegisterDto): Promise<AuthResponseDto> {
  try {
    const response = await axios.post<AuthResponseDto>('/account/register', registerDto);
    return response.data;
  } catch (error: any) {
    // Si el servidor respondió con datos de error, lanzar esos datos
    if (error.response?.data) {
      throw error.response.data;
    }
    // Si no hay respuesta del servidor (error de conexión), lanzar el mensaje del error
    throw error.message;
  }
}

export async function apiLogout(): Promise<AuthResponseDto> {
  try {
    const response = await axios.post<AuthResponseDto>('/account/logout');
    const data = response.data;

    console.log('📋 Respuesta de logout del backend:', data);

    if (data.isSuccess) {
      // Limpiar tokens
      await clearTokens();
    } else {
      // El backend devolvió isSuccess: false, convertirlo en error categorizado
      const clientError: ApiError = {
        type: ErrorType.CLIENT_ERROR,
        message: data.message || 'Error al cerrar sesión',
        statusCode: 400, // Asumir error del cliente
        originalError: { response: { data, status: 400 } }
      };
      throw clientError;
    }

    return data;
  } catch (error: any) {
    // Si ya es un ApiError (de arriba), relanzarlo
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }

    // Categorizar el error y lanzar el error estructurado
    const categorizedError = categorizeError(error);
    console.log(`📋 Error categorizado: ${categorizedError.type} - ${categorizedError.message}`);

    throw categorizedError;
  }
}

export async function apiRefreshToken(): Promise<AuthResponseDto> {
  try {
    const { token } = await getTokens();
    const refreshToken = await getRefreshToken();

    if (!token) {
      throw new Error('No access token available');
    }

    const user = decodeToken(token);
    const email = user?.email;

    if (!refreshToken || !email) {
      throw new Error('No refresh token or email available');
    }

    const response = await axios.post<AuthResponseDto>('/account/refresh-token', {
      Email: email,
      RefreshToken: refreshToken,
    } as RefreshTokenDto);

    const data = response.data;
    if (data.isSuccess) {
      await setTokens({ token: data.token, refreshToken: data.refreshToken });
    }

    return data;
  } catch (error: any) {
    // Si el servidor respondió con datos de error, lanzar esos datos
    if (error.response?.data) {
      throw error.response.data;
    }
    // Si no hay respuesta del servidor (error de conexión), lanzar el mensaje del error
    throw error.message;
  }
}

// Agrega más funciones según necesites (forgot-password, change-password, etc.)