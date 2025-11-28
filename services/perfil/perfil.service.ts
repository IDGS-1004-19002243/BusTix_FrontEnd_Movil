import axios from '../auth/interceptors'; // Importa axios configurado con interceptores
import { categorizeError } from '../api-errors';

export interface PerfilUsuario {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  urlFotoPerfil: string;
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
  estatus: string;
  fechaRegistro: string;
  ultimaConexion: string;
}

export interface GetPerfilResponse {
  success: boolean;
  data: PerfilUsuario;
}

export interface UpdateProfileDto {
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  urlFotoPerfil?: string;
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
}

export interface UpdatePerfilResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function apiGetMiPerfil(): Promise<GetPerfilResponse> {
  try {
    const response = await axios.get<GetPerfilResponse>('/me/perfil');
    return response.data;
  } catch (error: any) {
    const categorizedError = categorizeError(error);
    throw categorizedError;
  }
}

export async function apiUpdateMiPerfil(dto: UpdateProfileDto): Promise<UpdatePerfilResponse> {
  try {
    const response = await axios.put<UpdatePerfilResponse>('/me/perfil', dto);
    return response.data;
  } catch (error: any) {
    const categorizedError = categorizeError(error);
    throw categorizedError;
  }
}