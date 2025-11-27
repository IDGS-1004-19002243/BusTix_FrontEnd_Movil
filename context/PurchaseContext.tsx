import React, { createContext, useContext, useState } from 'react';

/**
 * Genera un token aleatorio único para la sesión de compra
 */
export function generateSessionToken(): string {
  return Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * PasajeroData - Define la estructura de datos de un pasajero
 */
export interface PasajeroData {
  nombre: string;
  email: string;
  telefono: string;
}

/**
 * PaymentData - Define la estructura de datos de pago
 */
export interface PaymentData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

/**
 * PurchaseData - Define la estructura de los datos de compra
 */
interface PurchaseData {
  eventId: string;        // ID único del evento
  eventSlug: string;      // Nombre del evento en formato URL (slug)
  eventName: string;      // Nombre descriptivo del evento
  eventImage: string;     // URL de la imagen del evento
  quantity: number;       // Número de boletos a comprar
  pricePerTicket: number; // Precio individual de cada boleto
  viajeId: number;        // ID del viaje seleccionado
  paradaAbordajeId: number; // ID de la parada de abordaje seleccionada
  ciudadAbordaje?: string; // Ciudad del punto de abordaje seleccionado
  pasajeros?: PasajeroData[]; // Datos de los pasajeros
  paymentData?: PaymentData; // Datos de pago
  sessionToken: string;   // Token único para validar sesión de compra
  timestamp: number;      // Hora de creación (para validar expiración)
}

/**
 * PurchaseContextType - Define qué funciones y datos están disponibles en el contexto
 */
interface PurchaseContextType {
  purchaseData: PurchaseData | null;
  setPurchaseData: (data: PurchaseData) => void;
  updatePurchaseData: (updates: Partial<PurchaseData>) => void;
  clearPurchaseData: () => void;
  validatePurchaseData: () => boolean;
  isTransactionOverlayVisible: boolean;
  setTransactionOverlayVisible: (visible: boolean) => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [purchaseData, setPurchaseDataState] = useState<PurchaseData | null>(null);
  const [isTransactionOverlayVisible, setIsTransactionOverlayVisible] = useState(false);

  const setPurchaseData = (data: PurchaseData) => {
    const sessionToken = data.sessionToken || generateSessionToken();
    
    setPurchaseDataState({
      ...data,
      sessionToken,
      timestamp: Date.now(),
    });
  };

  const updatePurchaseData = (updates: Partial<PurchaseData>) => {
    if (purchaseData) {
      setPurchaseDataState({
        ...purchaseData,
        ...updates,
        timestamp: Date.now(),
      });
    }
  };

  const clearPurchaseData = () => {
    setPurchaseDataState(null);
  };

  const validatePurchaseData = (): boolean => {
    if (!purchaseData) return false;
    
    const TEN_MINUTES = 10 * 60 * 1000;
    const tiempoTranscurrido = Date.now() - purchaseData.timestamp;
    const isValid = tiempoTranscurrido < TEN_MINUTES;
    
    if (!isValid) {
      clearPurchaseData();
      return false;
    }

    return isValid;
  };

  const setTransactionOverlayVisible = (visible: boolean) => {
    setIsTransactionOverlayVisible(visible);
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchaseData,
        setPurchaseData,
        updatePurchaseData,
        clearPurchaseData,
        validatePurchaseData,
        isTransactionOverlayVisible,
        setTransactionOverlayVisible,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }

  return context;
}