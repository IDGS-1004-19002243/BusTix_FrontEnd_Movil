import axios from 'axios';

/**
 * Obtiene la ciudad a partir de latitud y longitud usando Geoapify
 */
export async function apiReverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        const baseUrl = process.env.EXPO_PUBLIC_GEOAPIFY_BASE_URL;
        const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
        const axiosInstance = axios.create();
        const response = await axiosInstance.get(`${baseUrl}/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`);
        const data = response.data;
        if (data.features && data.features.length > 0) {
            return data.features[0].properties.county || 'Ciudad desconocida';
        }
        return 'Ciudad desconocida';
    } catch (error: any) {
        return 'Ciudad desconocida';
    }
}