import React, { useEffect, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { apiGetMisViajesChofer, Viaje } from '@/services/viajes';
import LoadingScreen from '@/components/compra/LoadingScreen';
import ViajeCard from '@/components/mis-viajes/ViajeCard';
import { useSession } from '@/context/AuthContext';
import { getGridConfig } from '@/components/eventos/hooks/useEventos';
import { styles } from '@/components/mis-viajes/styles';

export default function MisViajes() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const gridConfig = getGridConfig(width, isMobile);

  const fetchViajes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetMisViajesChofer();
      const filteredViajes = response.filter(viaje => viaje.choferID === user?.id);
      setViajes(filteredViajes);
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <VStack space="lg">
        <Heading size="xl" className="text-center">
          Mis Viajes
        </Heading>
        {viajes.length === 0 ? (
          <Text className="text-center text-gray-600">No tienes viajes asignados.</Text>
        ) : (
          <View style={[styles.gridContainer, { justifyContent: "center" }]}>
            {viajes.map((viaje) => (
              <View
                key={viaje.viajeID}
                style={[styles.cardWrapper, { width: gridConfig.cardWidth }]}
              >
                <ViajeCard
                  viaje={viaje}
                  gridConfig={gridConfig}
                />
              </View>
            ))}
          </View>
        )}
      </VStack>
    </ScrollView>
  );
}