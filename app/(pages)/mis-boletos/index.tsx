import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { apiGetUserBoletos, BoletoUsuario, EventoUsuario } from '@/services/boletos/boletos.service';
import WithTickets from '@/components/mis-boletos/WithTickets';
import NoTickets from '@/components/mis-boletos/NoTickets';
import LoadingScreen from '@/components/compra/LoadingScreen';

export default function MisBoletos() {
  const [eventos, setEventos] = useState<EventoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBoletos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetUserBoletos();
      if (response.success) {
        setEventos(response.data);
      } else {
        setError('Error al obtener los boletos');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los boletos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoletos();
  }, []);

  useEffect(() => {
    if (!loading && eventos.length === 0 && !error) {
      // Si no hay eventos, redirigir a eventos
      router.replace('/(pages)/eventos');
    }
  }, [loading, eventos, error, router]);

  if (loading) {
    return <LoadingScreen message="Cargando tus boletos..." />;
  }

  if (error) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <VStack space="lg" className="items-center">
          <Heading size="xl" className="text-center text-red-600 mx-8">
            Error
          </Heading>
          <Text className="text-center text-gray-600">{error}</Text>
          <Button onPress={fetchBoletos} size="md" action="positive">
            <ButtonText>Reintentar</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    );
  }

  // Si hay eventos, mostrar la lista
  if (eventos.length > 0) {
    return <WithTickets eventos={eventos} />;
  }

  // Si no hay boletos, mostrar el componente NoTickets (aunque se redirige, por si acaso)
  return <NoTickets />;
}