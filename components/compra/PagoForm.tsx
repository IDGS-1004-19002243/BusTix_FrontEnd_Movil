import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';

interface PagoFormProps {
  cardNumber: string;
  expiry: string;
  cvv: string;
  name: string;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

export default function PagoForm({
  cardNumber,
  expiry,
  cvv,
  name,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onNameChange,
}: PagoFormProps) {
  return (
    <VStack className="p-6">
      <Heading size="md" className="mb-4"><Text>Información de Pago</Text></Heading>
      <VStack space="md">
        <Input>
          <InputField
            placeholder="Número de Tarjeta"
            value={cardNumber}
            onChangeText={onCardNumberChange}
            keyboardType="numeric"
          />
        </Input>
        <HStack space="md">
          <Input className="flex-1">
            <InputField
              placeholder="MM/YY"
              value={expiry}
              onChangeText={onExpiryChange}
            />
          </Input>
          <Input className="flex-1">
            <InputField
              placeholder="CVV"
              value={cvv}
              onChangeText={onCvvChange}
              keyboardType="numeric"
            />
          </Input>
        </HStack>
        <Input>
          <InputField
            placeholder="Nombre en la Tarjeta"
            value={name}
            onChangeText={onNameChange}
          />
        </Input>
      </VStack>
    </VStack>
  );
}
