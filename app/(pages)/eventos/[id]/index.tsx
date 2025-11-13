import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { InfoIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { initialEvents, Event } from '../eventsData';
import Seo from '@/components/helpers/Seo';

export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const event = initialEvents.find((e: Event) => e.id === id);

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Seo title="Evento no encontrado" description="El evento solicitado no existe." />
        <Text className="text-xl text-gray-600">Evento no encontrado</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <ButtonText>Volver</ButtonText>
        </Button>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'muted'> = {
      'Música': 'success',
      'Teatro': 'info',
      'Danza': 'warning',
      'Comedia': 'error',
      'Ópera': 'muted',
    };
    return colors[category] || 'muted';
  };

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Seo title={event.name} description={event.description} />
      <VStack space="lg">
        <Button onPress={() => router.back()} variant="outline" className="self-start">
          <ButtonText>← Volver</ButtonText>
        </Button>

        {showSuccess && (
          <Alert action="success" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>
              ¡Compra exitosa! {quantity} boleto(s) reservado(s).
            </AlertText>
          </Alert>
        )}

        <Card className="bg-white shadow-lg">
          <VStack className="p-6">
            <Heading size="xl" className="mb-4">{event.name}</Heading>
            
            <Badge action={getCategoryColor(event.category)} size="md" className="self-start mb-4">
              <BadgeText>{event.category}</BadgeText>
            </Badge>

            <VStack space="md" className="mb-6">
              <HStack className="justify-between">
                <Text className="text-lg font-semibold">📅 Fecha:</Text>
                <Text className="text-lg">{formatDate(event.date)}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-lg font-semibold">⏰ Hora:</Text>
                <Text className="text-lg">{event.time}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-lg font-semibold">📍 Ubicación:</Text>
                <Text className="text-lg">{event.location}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-lg font-semibold">💰 Precio:</Text>
                <Text className="text-2xl font-bold text-green-600">${event.price}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-lg font-semibold">🎫 Boletos disponibles:</Text>
                <Text className="text-lg">{event.availableTickets}</Text>
              </HStack>
            </VStack>

            <Text className="text-gray-700 text-lg leading-6 mb-6">{event.description}</Text>

            <HStack className="justify-between items-center">
              <Badge 
                action={event.availableTickets > 50 ? 'success' : event.availableTickets > 20 ? 'warning' : 'error'} 
                size="lg"
              >
                <BadgeText>
                  {event.availableTickets > 50 ? 'Disponible' : event.availableTickets > 20 ? 'Últimas entradas' : 'Agotándose'}
                </BadgeText>
              </Badge>
              <Button size="lg" onPress={() => setShowModal(true)}>
                <ButtonText>Comprar Boleto</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Comprar Boleto</Heading>
            <ModalCloseButton onPress={() => setShowModal(false)}>
              <Text>✕</Text>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text className="text-lg mb-4">¿Confirmas la compra de boletos para {event.name}?</Text>
            <VStack space="md" className="mb-4">
              <HStack className="items-center justify-center space-x-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onPress={() => setQuantity(Math.max(0, quantity - 1))}
                  className='mr-2'
                >
                  <ButtonText>-</ButtonText>
                </Button>
                <Text className="text-lg font-semibold">{quantity} boleto(s)</Text>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onPress={() => setQuantity(quantity + 1)}
                  className='ml-2'
                >
                  <ButtonText>+</ButtonText>
                </Button>
              </HStack>
            </VStack>
            <Text className="text-lg font-semibold">
              Precio total: ${event.price * quantity}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onPress={() => setShowModal(false)} className="mr-2">
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={() => {
              setShowModal(false);
              setShowSuccess(true);
            }}>
              <ButtonText>Confirmar Compra</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}