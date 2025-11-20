// Utilidades para manejo de errores de API
export enum ErrorType {
  CLIENT_ERROR = 'CLIENT_ERROR',     // 4xx - Errores del cliente
  SERVER_ERROR = 'SERVER_ERROR',     // 5xx - Errores del servidor
  NETWORK_ERROR = 'NETWORK_ERROR'    // Sin conexión - Errores de red
}

export interface ApiError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
}

// Función helper para categorizar errores de API
export function categorizeError(error: any): ApiError {
  // Si hay respuesta del servidor
  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.Message || error.response.data?.message;

    // Errores del cliente (4xx) - mostrar mensaje específico del backend
    if (status >= 400 && status < 500) {
      return {
        type: ErrorType.CLIENT_ERROR,
        message: serverMessage || 'Datos incorrectos. Verifica tu información',
        statusCode: status,
        originalError: error
      };
    }

    // Errores del servidor (5xx) - mostrar mensaje genérico
    if (status >= 500) {
      return {
        type: ErrorType.SERVER_ERROR,
        message: 'Error interno. Inténtalo más tarde',
        statusCode: status,
        originalError: error
      };
    }
  }

  // Sin respuesta del servidor - error de conectividad
  return {
    type: ErrorType.NETWORK_ERROR,
    message: 'Verifica tu conexión a internet',
    originalError: error
  };
}