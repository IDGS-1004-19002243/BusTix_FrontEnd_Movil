import React, { useState, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { apiGetUserBoletos, EventoUsuario, Transaccion, BoletoUsuario } from '@/services/boletos/boletos.service';
import LoadingScreen from '@/components/compra/LoadingScreen';
import Seo from '@/components/helpers/Seo';
import QRCode from 'react-native-qrcode-svg';
import { formatDate } from '@/components/eventos/hooks/useEventos';

export const options = {
  title: 'Detalle del Boleto',
  headerShown: true,
};

export default function BoletoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [boleto, setBoleto] = useState<BoletoUsuario | null>(null);
  const [evento, setEvento] = useState<EventoUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoletoDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiGetUserBoletos();
        if (response.success) {
          // Buscar el boleto en todos los eventos y transacciones
          let boletoEncontrado: BoletoUsuario | null = null;
          let eventoEncontrado: EventoUsuario | null = null;

          for (const eventoActual of response.data) {
            for (const transaccion of eventoActual.transacciones) {
              const boletoInTransaccion = transaccion.boletos.find((b: BoletoUsuario) => b.boletoID.toString() === id);
              if (boletoInTransaccion) {
                boletoEncontrado = boletoInTransaccion;
                eventoEncontrado = eventoActual;
                break;
              }
            }
            if (boletoEncontrado) break;
          }

          if (boletoEncontrado && eventoEncontrado) {
            setBoleto(boletoEncontrado);
            setEvento(eventoEncontrado);
          } else {
            setError('Boleto no encontrado');
          }
        } else {
          setError('Error al obtener los boletos');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el boleto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoletoDetail();
    }
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Cargando detalle del boleto..." />;
  }

  if (error || !boleto || !evento) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Heading size="md" className="text-center mb-4">
          {error || 'Boleto no encontrado'}
        </Heading>
        <Button onPress={() => router.back()}>
          <ButtonText>Volver</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={options} />
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <Seo title={`Boleto ${boleto!.codigoBoleto}`} description={`Detalle del boleto ${boleto!.codigoBoleto} para ${evento!.nombreEvento}.`} />

        {/* Header */}
        <VStack space="md" className="p-4">
          <Heading size="xl" className="text-center">
            🎫 Detalle del Boleto
          </Heading>

          <VStack space="xs" className="items-center">
            <Text className="text-gray-600 text-center">
              Evento: {evento!.nombreEvento}
            </Text>
            <Text className="text-gray-600 text-center">
              📅 {formatDate(evento!.fechaEvento)}
            </Text>
          </VStack>
        </VStack>

        {/* Detalle del Boleto */}
        <VStack space="lg" className="p-4">
          <Card className="p-6 bg-white border border-gray-200 shadow-lg rounded-lg">
            <VStack space="md">
              <Heading size="lg" className="text-blue-600 text-center border-b border-gray-200 pb-3">
                {boleto.codigoBoleto}
              </Heading>

              {/* Información Principal */}
              <Card className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <Heading size="md" className="text-gray-700 mb-4">📋 Información del Boleto</Heading>
                <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VStack space="sm">
                    <Text className="text-sm text-gray-600">
                      🪑 <Text className="font-semibold">Asiento:</Text> {boleto.numeroAsiento}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      👤 <Text className="font-semibold">Pasajero:</Text> {boleto.nombrePasajero}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      💵 <Text className="font-semibold">Precio:</Text> ${boleto.precioTotal.toFixed(2)}
                    </Text>
                  </VStack>
                  <VStack space="sm">
                    <Text className={`text-sm font-semibold ${boleto.estatus === 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      📋 <Text className="font-semibold">Estatus:</Text> {boleto.estatusNombre}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      📍 <Text className="font-semibold">Parada de Abordaje:</Text> {boleto.paradaAbordaje}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      📍 <Text className="font-semibold">Coordenadas:</Text> {boleto.paradaAbordajeLatitud.toFixed(6)}, {boleto.paradaAbordajeLongitud.toFixed(6)}
                    </Text>
                  </VStack>
                </View>
              </Card>

              {/* Código QR */}
              <Card className="p-6 bg-blue-50 border border-blue-200 rounded-lg items-center">
                <Heading size="md" className="text-blue-700 mb-4">📱 Código QR</Heading>
                <QRCode
                  value={boleto.codigoQR}
                  size={width < 768 ? 200 : 250}
                />
                <Text className="text-xs text-center mt-4 text-gray-600">
                  Presenta este código QR al abordar el autobús
                </Text>
              </Card>

              {/* Detalle del Viaje */}
              <Card className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Heading size="md" className="text-green-700 mb-4">🚍 Detalle del Viaje</Heading>
                <View className="space-y-3">
                  <Text className="text-sm text-gray-700">
                    📋 <Text className="font-semibold">Código del Viaje:</Text> {boleto.detalleViaje.codigoViaje}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    🛣️ <Text className="font-semibold">Ruta:</Text> {boleto.detalleViaje.ciudadOrigen} → {boleto.detalleViaje.ciudadDestino}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    🕐 <Text className="font-semibold">Fecha y Hora de Salida:</Text> {new Date(boleto.detalleViaje.fechaSalida).toLocaleString()}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    🏁 <Text className="font-semibold">Fecha y Hora de Llegada Estimada:</Text> {new Date(boleto.detalleViaje.fechaLlegadaEstimada).toLocaleString()}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    🚐 <Text className="font-semibold">Unidad:</Text> {boleto.detalleViaje.unidadPlacas} ({boleto.detalleViaje.unidadNumeroEconomico})
                  </Text>
                </View>
              </Card>

              {/* Información Adicional */}
              <Card className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Heading size="sm" className="text-yellow-700 mb-2">⚠️ Información Importante</Heading>
                <VStack space="xs">
                  <Text className="text-xs text-gray-700">
                    • Presenta este boleto y una identificación oficial al abordar
                  </Text>
                  <Text className="text-xs text-gray-700">
                    • El asiento está asignado y no puede cambiarse
                  </Text>
                  <Text className="text-xs text-gray-700">
                    • Llega a la parada de abordaje 30 minutos antes de la salida
                  </Text>
                  <Text className="text-xs text-gray-700">
                    • En caso de cancelación, contacta al soporte técnico
                  </Text>
                </VStack>
              </Card>
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </>
  );
}