import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { apiGetMisViajesChofer, Viaje } from '@/services/viajes';
import LoadingScreen from '@/components/compra/LoadingScreen';

export default function MisViajes() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchViajes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetMisViajesChofer();
      setViajes(response);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los viajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViajes();
  }, []);

  if (loading) {
    return <LoadingScreen message="Cargando tus viajes..." />;
  }

  if (error) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <VStack space="lg" className="items-center">
          <Heading size="xl" className="text-center text-red-600 mx-8">
            Error
          </Heading>
          <Text className="text-center text-gray-600">{error}</Text>
          <Button onPress={fetchViajes} size="md" action="positive">
            <ButtonText>Reintentar</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
      <VStack space="lg">
        <Heading size="xl" className="text-center">
          Mis Viajes
        </Heading>
        {viajes.length === 0 ? (
          <Text className="text-center text-gray-600">No tienes viajes asignados.</Text>
        ) : (
          viajes.map((viaje) => (
            <View key={viaje.viajeID} className="p-4 bg-white rounded-lg shadow">
              <Text className="font-bold">{viaje.eventoNombre}</Text>
              <Text>Ruta: {viaje.rutaNombre}</Text>
              <Text>Fecha: {new Date(viaje.fechaSalida).toLocaleDateString()}</Text>
              <Text>Hora: {new Date(viaje.fechaSalida).toLocaleTimeString()}</Text>
              <Text>Unidad: {viaje.unidadPlacas} - {viaje.unidadModelo}</Text>
              <Text>Asientos disponibles: {viaje.asientosDisponibles}</Text>
              <Text>Estatus: {viaje.estatusNombre}</Text>
            </View>
          ))
        )}
      </VStack>
    </ScrollView>
  );
}