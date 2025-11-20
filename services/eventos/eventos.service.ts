import axios from '../auth/interceptors'; // Importa axios configurado con interceptores
import { categorizeError, ErrorType, ApiError } from '../api-errors';
import { Event } from './eventos.types';

/**
 * Obtiene la lista de todos los eventos disponibles
 */
export async function apiGetEventos(): Promise<Event[]> {
    try {
        // La API devuelve directamente un array de eventos, no un objeto con isSuccess
        const response = await axios.get<Event[]>('/eventos');
        return response.data;
    } catch (error: any) {
        // Categorizar el error y lanzar el error estructurado
        const categorizedError = categorizeError(error);
        throw categorizedError;
    }
}

/**
 * Obtiene los detalles de un evento específico por ID
 */
export async function apiGetEventoById(id: string): Promise<Event> {
    try {
        // La API devuelve directamente el objeto del evento, no un objeto con isSuccess
        const response = await axios.get<Event>(`/eventos/${id}`);
        return response.data;
    } catch (error: any) {
        // Categorizar el error y lanzar el error estructurado
        const categorizedError = categorizeError(error);
        throw categorizedError;
    }
}
