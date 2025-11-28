import axios from '../auth/interceptors'; // Importa axios configurado con interceptores
import { categorizeError, ErrorType, ApiError } from '../api-errors';
import { Viaje, ViajeDetalleCliente, CalculoPrecioDto } from './viajes.types';

/**
 * Obtiene la lista de viajes para un evento específico
 */
export async function apiGetViajes(eventoId: string): Promise<Viaje[]> {
    try {
        const response = await axios.get<Viaje[]>(`/viajes?eventoId=${eventoId}`);
        return response.data;
    } catch (error: any) {
        const categorizedError = categorizeError(error);
        throw categorizedError;
    }
}

/**
 * Obtiene los detalles del viaje para el cliente
 */
export async function apiGetViajeDetalleCliente(viajeId: number): Promise<ViajeDetalleCliente> {
    try {
        const response = await axios.get<ViajeDetalleCliente>(`/viajes/${viajeId}/detalle-cliente`);
        return response.data;
    } catch (error: any) {
        const categorizedError = categorizeError(error);
        throw categorizedError;
    }
}

/**
 * Calcula el precio de un boleto antes de comprarlo
 */
export async function apiCalcularPrecio(viajeId: number, paradaAbordajeId?: number, cuponId?: number): Promise<CalculoPrecioDto> {
    try {
        const params = new URLSearchParams();
        params.append('viajeId', viajeId.toString());
        if (paradaAbordajeId) params.append('paradaAbordajeId', paradaAbordajeId.toString());
        if (cuponId) params.append('cuponId', cuponId.toString());
        
        const response = await axios.get<CalculoPrecioDto>(`/boletos/calcular-precio?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        const categorizedError = categorizeError(error);
        throw categorizedError;
    }
}

/**
 * Obtiene los viajes asignados al chofer (operador)
 */
export async function apiGetMisViajesChofer(): Promise<Viaje[]> {
    try {
        const response = await axios.get<Viaje[]>('/Viajes/mis-viajes');
        return response.data;
    } catch (error: any) {
        const categorizedError = categorizeError(error);
        throw categorizedError;
    }
}