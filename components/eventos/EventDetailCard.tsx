import React from 'react';
import { View, Text, Image } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Badge, BadgeText } from '@/components/ui/badge';
import {getCategoryColor, formatDateDetail } from './hooks/useEventos';
import { Event } from '@/services/eventos/eventos.types';
const eventoImage = require('@/assets/images/evento.jpg');

interface EventDetailCardProps {
  event: Event;
}

export default function EventDetailCard({ event }: EventDetailCardProps) {
  return (
    <View className="flex-1">
      <Heading size="xl" className="mb-4 mt-2 text-start">{event.nombre}</Heading>

      {/* Imagen como banner */}
      <View className="relative">
        <Image
          source={event.urlImagen ? { uri: event.urlImagen } : eventoImage}
          style={{ width: '100%', height: 300 }}
          resizeMode="cover"
        />
      </View>

      <VStack className="p-6 flex-1">

        {/* Descripción del evento */}
        <Text className="text-xl font-bold mb-2">Descripción</Text>
        <Text className="text-gray-700 text-lg leading-7 mb-3">{event.descripcion}</Text>

        <View className="flex items-start mb-4">
          <Badge action={getCategoryColor(event.tipoEvento)} size="md">
            <BadgeText>{event.tipoEvento}</BadgeText>
          </Badge>
        </View>

        {/* Detalles del evento */}
        <Text className="text-xl font-bold mb-2">Detalles del Evento</Text>
        <VStack space="md" className="mb-6">
          <HStack className="justify-between">
            <Text className="text-base font-semibold">📅 Fecha:</Text>
            <Text className="text-base">{formatDateDetail(event.fecha)}</Text>
          </HStack>
          <HStack className="justify-between">
            <Text className="text-base font-semibold">📍 Recinto:</Text>
            <Text className="text-base">{event.recinto}</Text>
          </HStack>
          <HStack className="justify-between">
            <Text className="text-base font-semibold">🏙️ Ciudad:</Text>
            <Text className="text-base">{event.ciudad}, {event.estado}</Text>
          </HStack>
          <HStack className="justify-between">
            <Text className="text-base font-semibold">🚌 Viajes disponibles:</Text>
            <Text className="text-base">{event.totalViajes}</Text>
          </HStack>
        </VStack>
      </VStack>
    </View>
  );
}