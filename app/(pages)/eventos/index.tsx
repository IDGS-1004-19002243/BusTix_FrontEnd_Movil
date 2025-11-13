import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { initialEvents, Event } from './eventsData';
import Seo from '@/components/helpers/Seo';

export default function EventosPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

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
      <Seo title="Eventos" description="Descubre y reserva entradas para los mejores eventos." />
      <VStack space="lg">
        <Heading size="xl" className="text-center">Eventos Disponibles 🎭</Heading>
        <Text className="text-center text-gray-600 mb-4">
          Descubre y reserva entradas para los mejores eventos
        </Text>

        <VStack space="md">
          {initialEvents.map(event => (
            <Card key={event.id} className="bg-white shadow-md">
              <VStack className="p-6">
                <HStack className="justify-between items-start mb-4">
                  <VStack className="flex-1">
                    <Heading size="lg" className="mb-2">{event.name}</Heading>
                    <Badge action={getCategoryColor(event.category)} size="sm" className="self-start mb-2">
                      <BadgeText>{event.category}</BadgeText>
                    </Badge>
                  </VStack>
                  <VStack className="items-end">
                    <Text className="text-2xl font-bold text-green-600">${event.price}</Text>
                    <Text className="text-sm text-gray-500">por entrada</Text>
                  </VStack>
                </HStack>

                <VStack space="sm" className="mb-4">
                  <HStack className="justify-between">
                    <Text className="text-sm text-gray-600">
                      📅 {formatDate(event.date)} a las {event.time}
                    </Text>
                  </HStack>
                  <HStack className="justify-between">
                    <Text className="text-sm text-gray-600">
                      📍 {event.location}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      🎫 {event.availableTickets} disponibles
                    </Text>
                  </HStack>
                </VStack>

                <Text className="text-gray-700 mb-4">{event.description}</Text>

                <HStack className={`justify-between items-center ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <Badge 
                    action={event.availableTickets > 50 ? 'success' : event.availableTickets > 20 ? 'warning' : 'error'} 
                    size="sm"
                  >
                    <BadgeText>
                      {event.availableTickets > 50 ? 'Disponible' : event.availableTickets > 20 ? 'Últimas entradas' : 'Agotándose'}
                    </BadgeText>
                  </Badge>
                  <Button size="sm" className={isMobile ? 'w-full' : 'ml-2'} onPress={() => router.push(`/eventos/${event.id}` as any)}>
                    <ButtonText>Ver Detalles</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
}