import React from "react";
import { View, Text, Image } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Badge, BadgeText } from "@/components/ui/badge";
import { getCategoryColor, formatDateDetail } from "./hooks/useEventos";
import { Event } from "@/services/eventos/eventos.types";
import { ViajeDetalleCliente } from "@/services/viajes/viajes.types";
const eventoImage = require("@/assets/images/evento.jpg");

interface EventDetailCardProps {
  event: Event;
  viajeDetalle?: ViajeDetalleCliente | null;
  paradasWithCities?: any[];
}

export default function EventDetailCard({
  event,
  viajeDetalle,
  paradasWithCities,
}: EventDetailCardProps) {
  return (
    <View className="flex-1">
      <Heading size="xl" className="mb-4 mt-2 text-start">
        {event.nombre}
      </Heading>

      {/* Imagen como banner */}
      <View className="relative">
        <Image
          source={event.urlImagen ? { uri: event.urlImagen } : eventoImage}
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />
      </View>

      <VStack className="p-6 flex-1">
        {/* Descripción del evento */}
        <Text className="text-xl font-bold mb-2">Descripción</Text>
        <Text className="text-gray-700 text-lg leading-7 mb-3">
          {event.descripcion}
        </Text>

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
            <Text className="text-base">
              {event.ciudad === event.estado ? event.ciudad : `${event.ciudad}, ${event.estado}`}
            </Text>
          </HStack>
          <HStack className="justify-between">
            <Text className="text-base font-semibold">
              🚌 Viajes disponibles:
            </Text>
            <Text className="text-base">{event.totalViajes}</Text>
          </HStack>
          {viajeDetalle && (
            <HStack className="justify-between">
              <Text className="text-base font-semibold">💺 Asientos:</Text>
              {viajeDetalle.asientosDisponibles > 0 ? (
                <Text style={{ color: "green", fontWeight: "bold" }}>
                  Disponible
                </Text>
              ) : (
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  Agotado
                </Text>
              )}
            </HStack>
          )}
        </VStack>

        {/* Paradas del viaje */}
        {paradasWithCities && paradasWithCities.length > 0 && (
          <>
            <Text className="text-xl font-bold mb-2">Puntos de Abordaje</Text>
            <Text className="text-sm text-gray-600 mb-2">
              Selecciona tu punto de abordaje al momento de la compra
            </Text>
            <VStack space="md" className="mb-6">
              {paradasWithCities.map((parada) => (
                <HStack key={parada.paradaViajeID} className="justify-between">
                  <Text className="text-base font-semibold">
                    Parada {parada.ordenParada}:
                  </Text>
                  <Text className="text-base">{parada.city}</Text>
                </HStack>
              ))}
            </VStack>
            <Text className="text-sm text-black mt-2">
              <Text className="font-bold">Nota: </Text> 
              <Text className="italic text-gray-600"> Al momento de realizar tu
              compra, recibirás la dirección exacta del punto de
              abordaje seleccionado, además de la hora de abordaje.</Text>
            </Text>
          </>
        )}
      </VStack>
    </View>
  );
}
