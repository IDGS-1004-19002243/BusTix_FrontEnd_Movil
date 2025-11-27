import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { useToastManager } from '@/components/toast';

// Componentes de compra
import DetalleEvento from '@/components/compra/DetalleEvento';
import PasajerosForm, { PasajeroData } from '@/components/compra/PasajerosForm';
import PagoForm from '@/components/compra/PagoForm';
import ConfirmacionCompra from '@/components/compra/ConfirmacionCompra';
import SuccessCompra from '@/components/compra/SuccessCompra';

// Servicios
import { IniciarCompraDto } from '@/services/boletos/boletos.service';

// Hooks
import { usePurchaseProcess } from './hooks/usePurchaseProcess';
import { usePurchase } from '@/context/PurchaseContext';


interface StepperProps {
  eventName: string;
  eventImage: string;
  quantity: number;
  pricePerTicket: number;
  total: number;
  viajeId: number;
  paradaAbordajeId: number;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
  onCardNumberChange: (value: string) => void;
  onExpiryMonthChange: (value: string) => void;
  onExpiryYearChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onNameChange: (value: string) => void;
  pasajeros: PasajeroData[];
  onPasajerosChange: (pasajeros: PasajeroData[]) => void;
  onFinish: () => void;
  bottomInset: number;
}

export default function Stepper({
  eventName,
  eventImage,
  quantity,
  pricePerTicket,
  total,
  viajeId,
  paradaAbordajeId,
  cardNumber,
  expiryMonth,
  expiryYear,
  cvv,
  name,
  onCardNumberChange,
  onExpiryMonthChange,
  onExpiryYearChange,
  onCvvChange,
  onNameChange,
  pasajeros,
  onPasajerosChange,
  onFinish,
  bottomInset,
}: StepperProps) {
  const [isPasajerosValid, setIsPasajerosValid] = useState(false);
  const [isPagoValid, setIsPagoValid] = useState(false);
  const { showToast } = useToastManager();
  const [showPasajerosErrors, setShowPasajerosErrors] = useState(false);
  const [showPagoErrors, setShowPagoErrors] = useState(false);
  const { isConfirming, alertType, alertMessage, successData, handleConfirmPurchase, clearAlert } = usePurchaseProcess(onFinish);
  const { updatePurchaseData } = usePurchase();

  const handleSubmitPurchase = () => {
    const dto: IniciarCompraDto = {
      ViajeID: viajeId,
      Pasajeros: pasajeros.map(pasajero => ({
        NombrePasajero: pasajero.nombre,
        EmailPasajero: pasajero.email,
        TelefonoPasajero: pasajero.telefono,
      })),
      ParadaAbordajeID: paradaAbordajeId,
    };
    handleConfirmPurchase(dto);
  };

  useEffect(() => {
    if (isPasajerosValid) {
      setShowPasajerosErrors(false);
    }
  }, [isPasajerosValid]);

  useEffect(() => {
    if (isPagoValid) {
      setShowPagoErrors(false);
    }
  }, [isPagoValid]);

  // Guardar datos de pasajeros en el contexto cuando cambien
  useEffect(() => {
    if (pasajeros.length > 0) {
      updatePurchaseData({ pasajeros });
    }
  }, [pasajeros]);

  // Guardar datos de pago en el contexto cuando cambien
  useEffect(() => {
    if (cardNumber || name) {
      updatePurchaseData({
        paymentData: {
          cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
          name,
        },
      });
    }
  }, [cardNumber, expiryMonth, expiryYear, cvv, name]);

  // Si hay datos de éxito, mostrar pantalla de éxito en lugar del stepper
  if (successData) {
    return <SuccessCompra data={successData} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: bottomInset }}>
      <ProgressSteps
        activeStepIconBorderColor="#2D2D2D"
        progressBarColor="#EBEBE4"
        completedProgressBarColor="#2D2D2D"
        activeStepIconColor="transparent"
        completedStepIconColor="#2D2D2D"
        disabledStepIconColor="#EBEBE4"
        labelColor="#D3D3D3"
        activeLabelColor="#2D2D2D"
        completedLabelColor="#2D2D2D"
        activeStepNumColor="#2D2D2D"
        completedStepNumColor="#2D2D2D"
        disabledStepNumColor="#FFFFFF"
        completedCheckColor="#FFFFFF"
      >
        <ProgressStep
          label="Evento"
          buttonNextText="Siguiente"
          buttonFillColor="#FFFFFF"
          buttonNextTextColor="#2D2D2D"
        >
          <DetalleEvento
            eventName={eventName}
            eventImage={eventImage}
            quantity={quantity}
            viajeId={viajeId}
            paradaAbordajeId={paradaAbordajeId}
          />
        </ProgressStep>

        <ProgressStep
          label="Pasajeros"
          buttonNextText="Siguiente"
          buttonPreviousText="Anterior"
          buttonFillColor="#FFFFFF"
          buttonBorderColor="transparent"
          buttonNextTextColor="#2D2D2D"
          buttonPreviousTextColor="#2D2D2D"
          errors={!isPasajerosValid}
          onNext={() => {
            if (!isPasajerosValid) {
              setShowPasajerosErrors(true);
              showToast({
                type: 'error',
                title: 'Campos incompletos',
                description: 'Por favor, completa toda la información antes de continuar'
              });
            }
          }}
        >
          <PasajerosForm
            quantity={quantity}
            pasajeros={pasajeros}
            onPasajerosChange={onPasajerosChange}
            onValidationChange={setIsPasajerosValid}
            forceShowErrors={showPasajerosErrors}
          />
        </ProgressStep>

        <ProgressStep
          label="Pago"
          buttonNextText="Siguiente"
          buttonPreviousText="Anterior"
          buttonFillColor="#FFFFFF"
          buttonBorderColor="transparent"
          buttonNextTextColor="#2D2D2D"
          buttonPreviousTextColor="#2D2D2D"
          errors={!isPagoValid}
          onNext={() => {
            if (!isPagoValid) {
              setShowPagoErrors(true);
              showToast({
                type: 'error',
                title: 'Información de pago incompleta',
                description: 'Por favor, completa toda la información de pago antes de continuar'
              });
            }
          }}
        >
          <PagoForm
            cardNumber={cardNumber}
            expiryMonth={expiryMonth}
            expiryYear={expiryYear}
            cvv={cvv}
            name={name}
            onCardNumberChange={onCardNumberChange}
            onExpiryMonthChange={onExpiryMonthChange}
            onExpiryYearChange={onExpiryYearChange}
            onCvvChange={onCvvChange}
            onNameChange={onNameChange}
            onValidationChange={setIsPagoValid}
            forceShowErrors={showPagoErrors}
          />
        </ProgressStep>

        <ProgressStep
          label="Confirmar"
          buttonFinishText={isConfirming ? "Procesando..." : "Confirmar"}
          onSubmit={handleSubmitPurchase}
          buttonPreviousText="Anterior"
          buttonFillColor="#FFFFFF"
          buttonBorderColor="transparent"
          buttonFinishTextColor="#2D2D2D"
          buttonPreviousTextColor="#2D2D2D"
        >
          <ConfirmacionCompra
            alertType={alertType}
            alertMessage={alertMessage}
            clearAlert={clearAlert}
          />
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
}