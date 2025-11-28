import React from 'react';
import { View, Linking } from 'react-native';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Viaje } from '@/services/viajes';
import { styles } from './styles';

interface ViajeCardProps {
  viaje: Viaje;
  onPressVerDetalles?: (viaje: Viaje) => void;
  gridConfig: any;
}

export default function ViajeCard({ viaje, onPressVerDetalles, gridConfig }: ViajeCardProps) {
  const router = useRouter();
  return (
    <Card className="bg-white shadow-md" style={gridConfig.columns === 1 ? styles.cardMobile : styles.card}>
      {/* Contenido de la tarjeta */}
      <VStack space="sm" className="p-4" style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Heading size="sm" numberOfLines={2}>
            {viaje.eventoNombre}
          </Heading>
        </View>

        {/* Información del viaje */}
        <VStack space="xs" style={{ flex: 1, justifyContent: 'center', marginBottom: 10 }}>
          <Text className="text-xs text-gray-600 mb-1">
            📍 Ruta: {viaje.rutaNombre}
          </Text>
          <Text className="text-xs text-gray-600">
            📅 {new Date(viaje.fechaSalida).toLocaleDateString()} - {new Date(viaje.fechaSalida).toLocaleTimeString()}
          </Text>
          <Text className="text-xs text-gray-600">
            🚐 Unidad: {viaje.unidadPlacas} - {viaje.unidadModelo}
          </Text>
        </VStack>

        {/* Botón de acción */}
        <Button
          size="sm"
          className="w-full"
          onPress={() => (router.push as any)(`/ruta/${viaje.codigoViaje}`)}
        >
          <ButtonText className="text-xs">Ver Ruta</ButtonText>
        </Button>
      </VStack>
    </Card>
  );
}