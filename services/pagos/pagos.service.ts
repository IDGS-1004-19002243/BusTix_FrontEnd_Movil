import axios from '../auth/interceptors'; // Importa axios configurado con interceptores
import { categorizeError } from '../api-errors';

export interface ConfirmPaymentRequest {
  transaccionID: string;
  codigoPago: string;
  estado: string;
  proveedor: string;
  montoConfirmado: number;
}

export interface BoletoConfirmado {
  boletoId: number;
  codigoBoleto: string;
  estatus: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  codigoPago: string;
  transaccionId: string;
  boletos: BoletoConfirmado[];
}

// Función para generar UUID compatible con React Native
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const confirmPayment = async (codigoPago: string, montoConfirmado: number): Promise<ConfirmPaymentResponse> => {
  // Generate transaction ID compatible with React Native
  // Similar to C# Guid.NewGuid().ToString("N")[..12].ToUpper()
  const uuid = generateUUID().replace(/-/g, '').substring(0, 12).toUpperCase();
  const transaccionID = `SIM-${uuid}`;

  const payload: ConfirmPaymentRequest = {
    transaccionID,
    codigoPago,
    estado: 'approved',
    proveedor: 'Stripe',
    montoConfirmado,
  };

  try {
    const response = await axios.post<ConfirmPaymentResponse>('/pagos/confirmacion', payload);
    return response.data;
  } catch (error) {
    throw categorizeError(error);
  }
};