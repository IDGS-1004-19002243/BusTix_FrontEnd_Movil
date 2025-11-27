import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { apiCalcularPrecio } from '@/services/viajes/viajes.service';
import { usePurchase } from '@/context/PurchaseContext';

interface DetalleEventoProps {
  eventName: string;
  eventImage?: string; // URL de la imagen del evento (opcional)
  quantity: number;
  viajeId: number;
  paradaAbordajeId: number;
}

export default function DetalleEvento({ 
  eventName,
  eventImage,
  quantity, 
  viajeId,
  paradaAbordajeId
}: DetalleEventoProps) {
  const { purchaseData, updatePurchaseData } = usePurchase();
  const [localPrice, setLocalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (purchaseData?.pricePerTicket && purchaseData.pricePerTicket > 0) {
      setLocalPrice(purchaseData.pricePerTicket);
    }
  }, [purchaseData?.pricePerTicket]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (viajeId && paradaAbordajeId && localPrice === 0) {
        setLoading(true);
        try {
          const calculo = await apiCalcularPrecio(viajeId, paradaAbordajeId);
          setLocalPrice(calculo.precioTotal);
          updatePurchaseData({ pricePerTicket: calculo.precioTotal });
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    };
    if (viajeId && paradaAbordajeId) {
      calculatePrice();
    }
  }, [viajeId, paradaAbordajeId]);

  const displayPrice = localPrice;
  const displayTotal = quantity * displayPrice;
  return (
    <VStack className="p-6">
      <Heading size="md" className="">Detalle Evento</Heading>
      
      <View className="bg-white rounded-lg p-4">
        {loading ? (
          <View className="items-center justify-center py-8">
            <Spinner size="large" color="green" />
            <Text className="text-sm text-gray-600 mt-2">Calculando precio...</Text>
          </View>
        ) : (
          <VStack space="md">
            <HStack className="items-center" space="lg">
              {eventImage ? (
                <View>
                  <Image 
                    source={{ uri: eventImage }}
                    style={{ height: 80, width: 80, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="w-20 h-20 bg-gray-200 rounded-lg items-center justify-center">
                  <Text className="text-gray-400 text-xs">Sin imagen</Text>
                </View>
              )}
              
              <VStack className="flex-1">
                <Text className="text-base font-semibold" numberOfLines={2}>
                  {eventName}
                </Text>
              </VStack>
            </HStack>
            
            {purchaseData?.ciudadAbordaje && (
              <View className="bg-gray-50 rounded-md p-3">
                <HStack className="items-center">
                  <Text className="text-sm font-bold text-gray-600">📍 Punto de abordaje: </Text>
                  <Text className="text-sm text-gray-800">{purchaseData.ciudadAbordaje}</Text>
                </HStack>
              </View>
            )}
            
            <View className="bg-gray-100 rounded-md p-3">
              <VStack space="sm">
                <HStack className="justify-between">
                  <Text className="text-sm font-bold text-gray-600">Cantidad:</Text>
                  <Text className="text-sm">{quantity} {quantity === 1 ? 'boleto' : 'boletos'}</Text>
                </HStack>
                
                <HStack className="justify-between">
                  <Text className="text-sm font-bold text-gray-600">Precio unitario:</Text>
                  <Text className="text-sm">${displayPrice.toFixed(2)}</Text>
                </HStack>
                
                <HStack className="justify-between pt-2 border-t border-gray-300">
                  <Text className="text-base font-bold">Total:</Text>
                  <Text className="text-lg text-green-600">${displayTotal.toFixed(2)}</Text>
                </HStack>
              </VStack>
            </View>
          </VStack>
        )}
      </View>
    </VStack>
  );
}