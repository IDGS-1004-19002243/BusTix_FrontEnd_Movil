import { useState } from 'react';
import { apiIniciarCompra, IniciarCompraDto } from '@/services/boletos/boletos.service';
import { confirmPayment, ConfirmPaymentResponse } from '@/services/pagos/pagos.service';
import { usePurchase } from '@/context/PurchaseContext';
import { categorizeError } from '@/services/api-errors';

export const usePurchaseProcess = (onFinish: () => void) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [successData, setSuccessData] = useState<ConfirmPaymentResponse | null>(null);
  const { setTransactionOverlayVisible } = usePurchase();

  const handleConfirmPurchase = async (dto: IniciarCompraDto) => {
    // Limpiar alerta anterior al inicio de cualquier intento
    setAlertType(null);
    setAlertMessage('');

    // Verificar que todos los datos estén disponibles
    if (!dto.ViajeID || !dto.ParadaAbordajeID || !dto.Pasajeros.length) {
      setAlertType('error');
      setAlertMessage('Faltan datos para completar la compra. Por favor, verifica toda la información.');
      return;
    }

    setIsConfirming(true);
    setTransactionOverlayVisible(true);

    try {
      // Llamar a iniciar compra
      const iniciarResponse = await apiIniciarCompra(dto);

      // Si iniciar compra fue exitoso, llamar a confirmar pago
      const confirmResponse = await confirmPayment(iniciarResponse.codigoPago, iniciarResponse.montoTotal);

      // Validar que la confirmación fue exitosa
      if (!confirmResponse.success) {
        throw new Error('La confirmación del pago falló.');
      }

      // Si ambas llamadas fueron exitosas, mostrar pantalla de éxito
      setSuccessData(confirmResponse);

      // Llamar a onFinish después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        onFinish();
      }, 3000);

    } catch (error) {
      // Categorizar el error para logging pero mostrar mensaje genérico
      const apiError = categorizeError(error);

      setAlertType('error');
      // Mensaje genérico para todos los tipos de error
      setAlertMessage('No se pudo completar la compra, inténtalo de nuevo.');
    } finally {
      setIsConfirming(false);
      setTransactionOverlayVisible(false);
    }
  };

  return {
    isConfirming,
    alertType,
    alertMessage,
    successData,
    handleConfirmPurchase,
    clearAlert: () => setAlertType(null),
  };
};