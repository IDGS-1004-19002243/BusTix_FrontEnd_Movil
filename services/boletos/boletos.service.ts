import axios from '../auth/interceptors'; // Importa axios configurado con interceptores
import { categorizeError } from '../api-errors';

export interface PasajeroDto {
  NombrePasajero: string;
  EmailPasajero?: string;
  TelefonoPasajero?: string;
}

export interface IniciarCompraDto {
  ViajeID: number;
  Pasajeros: PasajeroDto[];
  ParadaAbordajeID?: number;
  CuponID?: number;
}

export interface IniciarCompraResponse {
  success: boolean;
  message: string;
  codigoPago: string;
  montoTotal: number;
  cantidadBoletos: number;
  boletos: string[];
}

export interface BoletoUsuario {
  boletoID: number;
  codigoBoleto: string;
  codigoQR: string;
  numeroAsiento: string;
  nombrePasajero: string;
  precioTotal: number;
  estatus: number;
  estatusNombre: string;
  paradaAbordaje: string;
  paradaAbordajeLatitud: number;
  paradaAbordajeLongitud: number;
  detalleViaje: {
    viajeID: number;
    codigoViaje: string;
    ciudadOrigen: string;
    ciudadDestino: string;
    fechaSalida: string;
    fechaLlegadaEstimada: string;
    unidadPlacas: string;
    unidadNumeroEconomico: string;
  };
}

export interface Transaccion {
  pagoID: number;
  codigoPago: string;
  transaccionID: string | null;
  fechaPago: string;
  montoTotal: number;
  metodoPago: string;
  boletos: BoletoUsuario[];
}

export interface EventoUsuario {
  eventoID: number;
  nombreEvento: string;
  imagenEvento: string;
  ubicacionEvento: string;
  fechaEvento: string;
  transacciones: Transaccion[];
}

export interface GetUserBoletosResponse {
  success: boolean;
  data: EventoUsuario[];
  total: number;
}

export async function apiGetUserBoletos(): Promise<GetUserBoletosResponse> {
  try {
    const response = await axios.get<GetUserBoletosResponse>('/me/boletos');
    return response.data;
  } catch (error: any) {
    const categorizedError = categorizeError(error);
    throw categorizedError;
  }
}

export async function apiIniciarCompra(dto: IniciarCompraDto): Promise<IniciarCompraResponse> {
  try {
    const response = await axios.post<IniciarCompraResponse>('/boletos/iniciar-compra', dto);
    return response.data;
  } catch (error: any) {
    const categorizedError = categorizeError(error);
    throw categorizedError;
  }
}