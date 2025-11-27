import React, { useState, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { apiGetUserBoletos, EventoUsuario, Transaccion, BoletoUsuario } from '@/services/boletos/boletos.service';
import LoadingScreen from '@/components/compra/LoadingScreen';
import Seo from '@/components/helpers/Seo';
import QRCode from 'react-native-qrcode-svg';
import { formatDate } from '@/components/eventos/hooks/useEventos';

export default function BoletosEventoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [evento, setEvento] = useState<EventoUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiGetUserBoletos();
        if (response.success) {
          const eventoEncontrado = response.data.find((e: EventoUsuario) => e.eventoID.toString() === id);
          if (eventoEncontrado) {
            setEvento(eventoEncontrado);
          } else {
            setError('Evento no encontrado');
          }
        } else {
          setError('Error al obtener los boletos');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar los boletos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoletos();
    }
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Cargando boletos del evento..." />;
  }

  if (error || !evento) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Heading size="md" className="text-center mb-4">
          {error || 'Evento no encontrado'}
        </Heading>
        <Button onPress={() => router.back()}>
          <ButtonText>Volver</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <Seo title={`Boletos - ${evento.nombreEvento}`} description={`Revisa tus boletos para ${evento.nombreEvento}.`} />

      {/* Header */}
      <VStack space="md" className="p-4 bg-white">
        <HStack space="md" className="items-center">
          <Button
            variant="outline"
            size="sm"
            onPress={() => router.back()}
          >
            <ButtonIcon as={ArrowLeftIcon} />
            <ButtonText>Volver</ButtonText>
          </Button>
        </HStack>

        <Heading size="xl" className="text-center">
          {evento.nombreEvento}
        </Heading>

        <VStack space="xs" className="items-center">
          <Text className="text-gray-600">
            📅 {formatDate(evento.fechaEvento)}
          </Text>
          <Text className="text-gray-600">
            📍 {evento.ubicacionEvento}
          </Text>
        </VStack>
      </VStack>

      {/* Transacciones y Boletos */}
      <VStack space="lg" className="p-4">
        {evento.transacciones
          .filter((transaccion: Transaccion) => transaccion.transaccionID)
          .map((transaccion: Transaccion) => (
          <Card key={transaccion.pagoID} className="p-4 bg-white border border-gray-200  rounded-lg">
            <VStack space="md">
              <Heading size="md" className="text-blue-600 border-b border-gray-200 pb-2">
                Transacción: {transaccion.codigoPago}
              </Heading>

              <VStack space="xs" className="p-3 rounded-md">
                <Text className="text-sm text-black">
                  <Text className="font-bold text-black">Fecha:</Text> {new Date(transaccion.fechaPago).toLocaleString()}
                </Text>
                <Text className="text-sm text-black">
                  <Text className="font-bold text-black">Monto:</Text> ${transaccion.montoTotal.toFixed(2)}
                </Text>
                <Text className="text-sm text-black">
                  <Text className="font-bold text-black">Método:</Text> {transaccion.metodoPago}
                </Text>
              </VStack> 

              <VStack space="sm" className="p-3 rounded-md">
                <Heading size="sm" className="text-black">Boletos:</Heading>
                {transaccion.boletos.map((boleto: BoletoUsuario) => (
                  <Card key={boleto.boletoID} className="bg-white border border-gray-200 rounded-lg">
                    <VStack space="sm">
                      <HStack space="md" className="items-center justify-between">
                        <VStack space="xs" className="flex-1">
                          <Text className="font-bold text-md text-blue-600">
                            {boleto.codigoBoleto}
                          </Text>
                          <HStack space="sm">
                            <Text className="text-sm text-black ">
                              <Text className="font-bold text-black">Nombre:</Text> {boleto.nombrePasajero}
                            </Text>
                            <Text className="text-sm text-black">
                              <Text className="font-bold text-black">Asiento:</Text> {boleto.numeroAsiento}
                            </Text>
                            <Text className="text-sm text-black">
                              <Text className="font-bold text-black">Unidad:</Text> {boleto.detalleViaje.unidadPlacas}
                            </Text>
                          </HStack>
                        </VStack>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => router.push({
                            pathname: "/boleto/[id]" as any,
                            params: { id: boleto.boletoID.toString() },
                          })}
                        >
                          <ButtonText>Ver Detalle</ButtonText>
                        </Button>
                      </HStack>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            </VStack>
          </Card>
        ))}
      </VStack>
    </ScrollView>
  );
}