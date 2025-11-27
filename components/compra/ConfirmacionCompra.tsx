import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { InfoIcon, CloseIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { TouchableOpacity } from 'react-native';
import { usePurchase } from '@/context/PurchaseContext';

interface ConfirmacionCompraProps {
  alertType?: string | null;
  alertMessage?: string;
  clearAlert?: () => void;
}

export default function ConfirmacionCompra({
  alertType,
  alertMessage,
  clearAlert,
}: ConfirmacionCompraProps) {
  const { purchaseData } = usePurchase();

  // Valores por defecto en caso de que purchaseData sea null
  const eventName = purchaseData?.eventName || 'Evento';
  const quantity = purchaseData?.quantity || 0;
  const pricePerTicket = purchaseData?.pricePerTicket || 0;
  const total = quantity * pricePerTicket;
  const pasajeros = purchaseData?.pasajeros || [];
  const cardNumber = purchaseData?.paymentData?.cardNumber || '';
  const name = purchaseData?.paymentData?.name || '';

  return (
    <VStack className="p-6" space="md">
      {alertType === 'error' && alertMessage && (
        <View style={{ maxHeight: 100 }}>
          <Alert action="error" variant="solid">
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1 gap-4">
                <AlertIcon as={InfoIcon} />
                <AlertText className="flex-1">{alertMessage}</AlertText>
              </HStack>
              <TouchableOpacity onPress={clearAlert}>
                <CloseIcon />
              </TouchableOpacity>
            </HStack>
          </Alert>
        </View>
      )}
      
      <Heading size="md"><Text>Confirmar Compra</Text></Heading>
      
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Resumen de Compra</Text>
        <Text>Evento: {eventName}</Text>
        <Text>Cantidad: {quantity} boleto(s)</Text>
        <Text className="text-xl font-bold mt-2">Total: ${total.toFixed(2)}</Text>
      </View>
      
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Pasajeros</Text>
        {pasajeros.length > 0 ? (
          pasajeros.map((pasajero, index) => (
            <View key={index} className="mb-2">
              <Text className="font-semibold">Pasajero {index + 1}:</Text>
              <Text className="text-sm">Nombre: {pasajero.nombre || 'No proporcionado'}</Text>
              <Text className="text-sm">Email: {pasajero.email || 'No proporcionado'}</Text>
              <Text className="text-sm">Teléfono: {pasajero.telefono || 'No proporcionado'}</Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-gray-500">No hay pasajeros registrados</Text>
        )}
      </View>
      
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Información de Pago</Text>
        {cardNumber ? (
          <>
            <Text>Tarjeta: **** **** **** {cardNumber.slice(-4)}</Text>
            <Text>Nombre: {name}</Text>
          </>
        ) : (
          <Text className="text-sm text-gray-500">No hay información de pago</Text>
        )}
      </View>
    </VStack>
  );
}
