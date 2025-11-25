import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { PasajeroData } from './PasajerosForm';

interface ConfirmacionCompraProps {
  eventName: string;
  quantity: number;
  total: number;
  cardNumber: string;
  name: string;
  pasajeros: PasajeroData[];
}

export default function ConfirmacionCompra({
  eventName,
  quantity,
  total,
  cardNumber,
  name,
  pasajeros,
}: ConfirmacionCompraProps) {
  return (
    <VStack className="p-6">
      <Heading size="md" className="mb-4"><Text>Confirmar Compra</Text></Heading>
      <VStack space="md">
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">Resumen de Compra</Text>
          <Text>Evento: {eventName}</Text>
          <Text>Cantidad: {quantity} boleto(s)</Text>
          <Text className="text-xl font-bold mt-2">Total: ${total.toFixed(2)}</Text>
        </View>
        
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">Pasajeros</Text>
          {pasajeros.map((pasajero, index) => (
            <View key={index} className="mb-2">
              <Text className="font-semibold">Pasajero {index + 1}:</Text>
              <Text className="text-sm">Nombre: {pasajero.nombre || 'No proporcionado'}</Text>
              <Text className="text-sm">Email: {pasajero.email || 'No proporcionado'}</Text>
              <Text className="text-sm">Teléfono: {pasajero.telefono || 'No proporcionado'}</Text>
            </View>
          ))}
        </View>
        
        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-lg font-semibold mb-2">Información de Pago</Text>
          <Text>Tarjeta: **** **** **** {cardNumber.slice(-4)}</Text>
          <Text>Nombre: {name}</Text>
        </View>
      </VStack>
    </VStack>
  );
}
