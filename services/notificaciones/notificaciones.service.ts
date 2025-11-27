import axios from '../auth/interceptors';
import { categorizeError } from '../api-errors';

export interface Notificacion {
  notificacionID: number;
  titulo: string;
  mensaje: string;
  tipoNotificacion: string;
  fechaCreacion: string;
  fueLeida: boolean;
  fechaLectura: string | null;
  viajeID: number | null;
  viaje: {
    codigo: string;
    origen: string;
    destino: string;
    fechaSalida: string;
  } | null;
  boletoID: number | null;
  boleto: {
    codigo: string;
    asiento: number;
  } | null;
}

export interface NotificacionesResponse {
  success: boolean;
  data: Notificacion[];
  pagination: {
    total: number;
    pagina: number;
    tamanoPagina: number;
    totalPaginas: number;
  };
}

export const apiGetMisNotificaciones = async (soloNoLeidas?: boolean, pagina = 1, tamanoPagina = 20): Promise<NotificacionesResponse> => {
  try {
    const params = new URLSearchParams();
    if (soloNoLeidas !== undefined) params.append('soloNoLeidas', soloNoLeidas.toString());
    params.append('pagina', pagina.toString());
    params.append('tamanoPagina', tamanoPagina.toString());

    const response = await axios.get<NotificacionesResponse>(`/me/notificaciones?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw categorizeError(error);
  }
};

export const apiMarcarNotificacionLeida = async (id: number): Promise<{ success: boolean; message: string; fechaLectura?: string }> => {
  try {
    const response = await axios.put<{ success: boolean; message: string; fechaLectura?: string }>(`/notificaciones/${id}/leer`);
    return response.data;
  } catch (error) {
    throw categorizeError(error);
  }
};

export const apiEliminarNotificacion = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete<{ success: boolean; message: string }>(`/notificaciones/${id}`);
    return response.data;
  } catch (error) {
    throw categorizeError(error);
  }
};

export const apiMarcarTodasLeidas = async (): Promise<{ success: boolean; message: string; actualizadas: number }> => {
  try {
    const response = await axios.put<{ success: boolean; message: string; actualizadas: number }>('/notificaciones/marcar-todas-leidas');
    return response.data;
  } catch (error) {
    throw categorizeError(error);
  }
};

export const apiGetCountNoLeidas = async (): Promise<{ success: boolean; count: number }> => {
  try {
    const response = await axios.get<{ success: boolean; count: number }>('/notificaciones/no-leidas/count');
    return response.data;
  } catch (error) {
    throw categorizeError(error);
  }
};