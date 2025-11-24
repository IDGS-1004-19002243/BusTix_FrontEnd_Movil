import React from 'react';
import { View, Image } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface DetalleEventoProps {
  eventName: string;
  eventImage?: string; // URL de la imagen del evento (opcional)
  quantity: number;
  pricePerTicket: number;
  total: number;
}

export default function DetalleEvento({ 
  eventName,
  eventImage,
  quantity, 
  pricePerTicket, 
  total 
}: DetalleEventoProps) {
  return (
    <VStack className="p-6">
      <Heading size="md" className="mb-4">Detalle Evento</Heading>
      
      <View className="bg-white rounded-lg p-4">
        <HStack className="items-start" space="lg">
          {eventImage ? (
            <View className="mr-8">
              <Image 
                source={{ uri: eventImage }}
                style={{ height: 100, width: 100, borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View className="w-25 h-25 bg-gray-200 rounded-lg items-center justify-center mr-8">
              <Text className="text-gray-400 text-xs">Sin imagen</Text>
            </View>
          )}
          
          <VStack className="flex-1">
            <Text className="text-base font-semibold mb-1" numberOfLines={2}>
              {eventName}
            </Text>
            
            <View>
              <HStack className="justify-between mb-1">
                <Text className="text-xs text-gray-600">Cantidad:</Text>
                <Text className="text-xs font-medium">{quantity} boleto(s)</Text>
              </HStack>
              
              <HStack className="justify-between mb-1">
                <Text className="text-xs text-gray-600">Precio unitario:</Text>
                <Text className="text-xs font-medium">${pricePerTicket.toFixed(2)}</Text>
              </HStack>
              
              <View className="mt-2">
                <HStack className="justify-between">
                  <Text className="text-sm font-bold">Total:</Text>
                  <Text className="text-lg font-bold text-green-600">${total.toFixed(2)}</Text>
                </HStack>
              </View>
            </View>
          </VStack>
        </HStack>
      </View>
    </VStack>
  );
}