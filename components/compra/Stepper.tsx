import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { useToastManager } from '@/components/toast';

// Componentes de compra
import DetalleEvento from '@/components/compra/DetalleEvento';
import PasajerosForm, { PasajeroData } from '@/components/compra/PasajerosForm';
import PagoForm from '@/components/compra/PagoForm';
import ConfirmacionCompra from '@/components/compra/ConfirmacionCompra';

interface StepperProps {
  eventName: string;
  eventImage: string;
  quantity: number;
  pricePerTicket: number;
  total: number;
  cardNumber: string;
  expiry: string;
  cvv: string;
  name: string;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
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
  cardNumber,
  expiry,
  cvv,
  name,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onNameChange,
  pasajeros,
  onPasajerosChange,
  onFinish,
  bottomInset,
}: StepperProps) {
  const [isPasajerosValid, setIsPasajerosValid] = useState(false);
  const { showToast } = useToastManager();
  const [showPasajerosErrors, setShowPasajerosErrors] = useState(false);

  useEffect(() => {
    if (isPasajerosValid) {
      setShowPasajerosErrors(false);
    }
  }, [isPasajerosValid]);

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
            pricePerTicket={pricePerTicket}
            total={total}
          />
        </ProgressStep>

        <ProgressStep
          label="Pasajeros"
          buttonNextText="Siguiente"
          buttonPreviousText="Anterior"
          buttonFillColor="#FFFFFF"
          buttonBorderColor="#2D2D2D"
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
          buttonBorderColor="#2D2D2D"
          buttonNextTextColor="#2D2D2D"
          buttonPreviousTextColor="#2D2D2D"
        >
          <PagoForm
            cardNumber={cardNumber}
            expiry={expiry}
            cvv={cvv}
            name={name}
            onCardNumberChange={onCardNumberChange}
            onExpiryChange={onExpiryChange}
            onCvvChange={onCvvChange}
            onNameChange={onNameChange}
          />
        </ProgressStep>

        <ProgressStep
          label="Confirmar"
          buttonFinishText="Confirmar"
          onSubmit={onFinish}
          buttonPreviousText="Anterior"
          buttonFillColor="#FFFFFF"
          buttonBorderColor="#2D2D2D"
          buttonFinishTextColor="#2D2D2D"
          buttonPreviousTextColor="#2D2D2D"
        >
          <ConfirmacionCompra
            eventName={eventName}
            quantity={quantity}
            total={total}
            cardNumber={cardNumber}
            name={name}
            pasajeros={pasajeros}
          />
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
}