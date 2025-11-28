import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Platform, View } from 'react-native';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { apiGetUserBoletos, EventoUsuario, Transaccion, BoletoUsuario } from '@/services/boletos/boletos.service';
import LoadingScreen from '@/components/compra/LoadingScreen';
import QRCode from 'react-native-qrcode-svg';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiGetExactAddress } from '@/services/geoapify';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '@/components/eventos/hooks/useEventos';

const getEstatusBadge = (estatus: string | number) => {
  const statusMap: Record<string | number, { text: string; variant: 'success' | 'error' | 'warning' | 'info' | 'muted' }> = {
    9: { text: 'Pendiente', variant: 'warning' },
    'BOL_PENDIENTE': { text: 'Pendiente', variant: 'warning' },
    10: { text: 'Pagado', variant: 'success' },
    'BOL_PAGADO': { text: 'Pagado', variant: 'success' },
    11: { text: 'Validado', variant: 'info' },
    'BOL_VALIDADO': { text: 'Validado', variant: 'info' },
    12: { text: 'Usado', variant: 'muted' },
    'BOL_USADO': { text: 'Usado', variant: 'muted' },
    13: { text: 'Cancelado', variant: 'error' },
    'BOL_CANCELADO': { text: 'Cancelado', variant: 'error' },
    14: { text: 'Pendiente', variant: 'warning' },
    'PAG_PENDIENTE': { text: 'Pendiente', variant: 'warning' },
    15: { text: 'Capturado', variant: 'success' },
    'PAG_CAPTURADO': { text: 'Capturado', variant: 'success' },
    16: { text: 'Rechazado', variant: 'error' },
    'PAG_RECHAZADO': { text: 'Rechazado', variant: 'error' },
  };
  return statusMap[estatus] || { text: estatus.toString(), variant: 'muted' as const };
};

export default function BoletoQRDetailScreen() {
  const { id: eventoId, transaccion, boleto } = useLocalSearchParams<{ id: string; transaccion: string; boleto: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [boletoData, setBoletoData] = useState<BoletoUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [addressData, setAddressData] = useState<{ address: string; state: string } | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const fetchBoletoDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetUserBoletos();
      if (response.success) {
        // Filtrar por eventoId
        const eventoEncontrado = response.data.find((e: EventoUsuario) => e.eventoID.toString() === eventoId);
        if (!eventoEncontrado) {
          setError('Evento no encontrado');
          return;
        }
        setEventName(eventoEncontrado.nombreEvento);

        // Filtrar por transaccionId
        const transaccionEncontrada = eventoEncontrado.transacciones.find((t: Transaccion) => t.transaccionID?.toString() === transaccion);
        if (!transaccionEncontrada) {
          setError('Transacción no encontrada');
          return;
        }

        // Filtrar por boletoId
        const boletoEncontrado = transaccionEncontrada.boletos.find((b: BoletoUsuario) => b.boletoID.toString() === boleto);
        if (!boletoEncontrado) {
          setError('Boleto no encontrado');
          return;
        }

        setBoletoData(boletoEncontrado);
      } else {
        setError('Error al obtener los boletos');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el boleto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventoId && transaccion && boleto) {
      fetchBoletoDetail();
    }
  }, [eventoId, transaccion, boleto]);

  useEffect(() => {
    if (boletoData && boletoData.paradaAbordajeLatitud && boletoData.paradaAbordajeLongitud) {
      setAddressLoading(true);
      apiGetExactAddress(boletoData.paradaAbordajeLatitud, boletoData.paradaAbordajeLongitud)
        .then((result) => {
          setAddressData(result);
          setAddressLoading(false);
        })
        .catch(() => {
          setAddressData({ address: 'Dirección no disponible', state: 'Estado desconocido' });
          setAddressLoading(false);
        });
    }
  }, [boletoData]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Pase de Abordaje',
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/mis-boletos');
              }
            }} className="p-2" activeOpacity={0.7}>
              <Image
                source={require('@/assets/icons/back.png')}
                style={{ width: 24, height: 24, marginLeft: 5, marginRight: Platform.OS === 'web' ? 3 : 11 }}
              />
            </TouchableOpacity>
          )
        }}
      />
      {loading || addressLoading ? (
        <LoadingScreen message="Cargando pase de abordaje..." />
      ) : error || boletoData === null ? (
        <VStack space="lg" className="items-center p-6">
          <Heading size="xl" className="text-center text-red-600 mx-8">
            Error
          </Heading>
          <Text className="text-center text-gray-600">{error || 'Boleto no encontrado'}</Text>
          <Button onPress={fetchBoletoDetail} size="md" action="positive">
            <ButtonText>Reintentar</ButtonText>
          </Button>
        </VStack>
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', marginBottom: insets.bottom }}>
          <VStack className="p-0">
            {/* Boarding Pass */}
            <View style={{ backgroundColor: 'white' }}>
              {/* Header - Green Banner */}
              <View style={{ backgroundColor: '#00A76F', padding: 20, paddingTop:10 }}>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 18, 
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: 5
                }}>
                  BusTix
                </Text>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 28, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  letterSpacing: 2
                }}>
                  PASE DE ABORDAJE
                </Text>
              </View>

              {/* Passenger Section */}
              <View style={{ backgroundColor: '#f8f9fa', padding: 16 }}>
                <HStack className="justify-between items-center">
                  <VStack>
                    <Text style={{ 
                      color: '#00A76F', 
                      fontSize: 16, 
                      fontWeight: '600',
                      marginBottom: 8
                    }}>
                      Pasajero
                    </Text>
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                      {boletoData!.nombrePasajero}
                    </Text>
                    
                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '600', marginTop: 8 }}>
                      {eventName}
                    </Text>
                  </VStack>
                  
                  <VStack className="items-center">
                    <Badge action={getEstatusBadge(boletoData!.estatus).variant} size="lg">
                      <BadgeText>{getEstatusBadge(boletoData!.estatus).text}</BadgeText>
                    </Badge>
                  </VStack>
                </HStack>
              </View>

              {/* Main Content */}
              <HStack className="p-6" style={{ gap: 15 }}>
                {/* QR Code Section */}
                <VStack className="items-center justify-center" style={{ flex: 0.7 }}>
                  <View style={{ 
                    padding: 12, 
                    backgroundColor: 'white',
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: '#e0e0e0'
                  }}>
                    <QRCode
                      value={boletoData!.codigoQR}
                      size={200}
                    />
                  </View>
                </VStack>

                {/* Details Section */}
                <VStack style={{ flex: 0.3, gap: 12 }}>
                  {/* Seat */}
                  <VStack>
                    <Text style={{ color: '#999', fontSize: 12, marginBottom: 2 }}>Asiento</Text>
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>
                      {boletoData!.numeroAsiento}
                    </Text>
                  </VStack>

                  {/* Board At */}
                  <VStack>
                    <Text style={{ color: '#999', fontSize: 12, marginBottom: 2 }}>Abordaje en</Text>
                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
                      {addressData?.address || 'N/A'}
                    </Text>
                  </VStack>

                  {/* Trip Code */}
                  <VStack>
                    <Text style={{ color: '#999', fontSize: 12, marginBottom: 2 }}>Viaje</Text>
                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
                      {boletoData!.codigoBoleto}
                    </Text>
                  </VStack>

                  {/* Date */}
                  <VStack>
                    <Text style={{ color: '#999', fontSize: 12, marginBottom: 2 }}>Fecha</Text>
                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
                      {formatDate(boletoData!.detalleViaje.fechaSalida)}
                    </Text>
                  </VStack>
                </VStack>
              </HStack>

              {/* Route Visualization */}
              <View style={{ 
                paddingHorizontal: 24, 
                paddingVertical: 20,
                backgroundColor: '#fafafa',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#e0e0e0'
              }}>
                <HStack className="items-center justify-between">
                  <VStack className="items-center" style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                      {addressData?.state || 'Origen'}
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#000' }}>
                      {addressData?.state?.substring(0, 3).toUpperCase() || 'ORI'}
                    </Text>
                  </VStack>

                  <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
                    <MaterialIcons name="directions-bus" size={32} color="#00A76F" />
                    <View style={{ 
                      height: 2, 
                      width: 60, 
                      backgroundColor: '#00A79F',
                      marginTop: 4
                    }} />
                  </View>

                  <VStack className="items-center" style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                      {boletoData!.detalleViaje.ciudadDestino}
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#000' }}>
                      {boletoData!.detalleViaje.ciudadDestino.substring(0, 3).toUpperCase()}
                    </Text>
                  </VStack>
                </HStack>
              </View>

              {/* Times Section */}
              <HStack className="justify-between p-6" style={{ backgroundColor: 'white' }}>
                <VStack className="items-center" style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                    Salida
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
                    {formatTime(boletoData!.detalleViaje.fechaSalida)}
                  </Text>
                </VStack>

                <VStack className="items-center" style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                    Unidad
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>
                    {boletoData!.detalleViaje.unidadPlacas}
                  </Text>
                </VStack>

                <VStack className="items-center" style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                    Llegada
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
                    {formatTime(boletoData!.detalleViaje.fechaLlegadaEstimada)}
                  </Text>
                </VStack>
              </HStack>

              {/* Footer - Green Banner */}
              <View style={{ backgroundColor: '#00A76F', padding: 20 }}>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 24, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  letterSpacing: 2
                }}>
                  PASE DE ABORDAJE
                </Text>
              </View>
            </View>
          </VStack>
        </ScrollView>
      )}
    </>
  );
}