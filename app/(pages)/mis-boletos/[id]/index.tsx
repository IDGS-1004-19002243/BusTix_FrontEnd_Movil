import React, { useState, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionIcon,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
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
      <VStack space="md" className="p-6 bg-white">
        <HStack space="md" className="items-center mb-4">
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
      <Accordion
        size="md"
        variant="unfilled"
        type="multiple"
        defaultValue={evento.transacciones.filter((t: Transaccion) => t.transaccionID).map((t: Transaccion) => `transaccion-${t.pagoID}`)}
        className="w-11/12 mx-auto p-4 mb-10"
      >
        {evento.transacciones
          .filter((transaccion: Transaccion) => transaccion.transaccionID)
          .map((transaccion: Transaccion) => (
          <AccordionItem key={transaccion.pagoID} value={`transaccion-${transaccion.pagoID}`}>
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: { isExpanded: boolean }) => (
                  <HStack style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: Platform.OS !== 'web' ? 20 : 0 }}>
                    <AccordionTitleText>
                      Transacción: {transaccion.codigoPago}
                    </AccordionTitleText>
                    {isExpanded ? (
                      <AccordionIcon as={ChevronUp} size="md" />
                    ) : (
                      <AccordionIcon as={ChevronDown} size="md" />
                    )}
                  </HStack>
                )}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <VStack space="md" className="p-4">
                <VStack space="xs" className="p-3 pb-0 rounded-md">
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

                <VStack space="sm" className="px-3 rounded-md">
                  <Heading size="sm" className="text-black">Boletos:</Heading>
                  <Accordion
                    size="md"
                    variant="unfilled"
                    type="multiple"
                    className="w-full"
                  >
                    {transaccion.boletos.map((boleto: BoletoUsuario) => (
                      <AccordionItem key={boleto.boletoID} value={`boleto-${boleto.boletoID}`}>
                        <AccordionHeader>
                          <AccordionTrigger>
                            {({ isExpanded }: { isExpanded: boolean }) => (
                              <HStack style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: Platform.OS !== 'web' ? 20 : 0 }}>
                                <HStack style={{ alignItems: 'center', gap: 8 }}>
                                  <AccordionTitleText>
                                    {boleto.codigoBoleto} - {boleto.nombrePasajero}
                                  </AccordionTitleText>
                                </HStack>
                                {isExpanded ? (
                                  <AccordionIcon as={ChevronUp} size="md" />
                                ) : (
                                  <AccordionIcon as={ChevronDown} size="md" />
                                )}
                              </HStack>
                            )}
                          </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionContent>
                          <VStack space="sm" className="p-4 pt-0">
                            {width < 768 ? (
                              <VStack space="md" className="items-center">
                                <VStack space="xs" className="flex-1 w-full">
                                  <Text className="font-bold text-md" style={{ color: "#00A76F" }}>
                                    {boleto.codigoBoleto}
                                  </Text>
                                  <VStack space="sm">
                                    <Text className="text-sm text-black ">
                                      <Text className="font-bold text-black">Nombre:</Text> {boleto.nombrePasajero}
                                    </Text>
                                    <Text className="text-sm text-black">
                                      <Text className="font-bold text-black">Asiento:</Text> {boleto.numeroAsiento}
                                    </Text>
                                    <Text className="text-sm text-black">
                                      <Text className="font-bold text-black">Unidad:</Text> {boleto.detalleViaje.unidadPlacas}
                                    </Text>
                                  </VStack>
                                  </VStack>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onPress={() => router.push({
                                    pathname: "/boleto/[id]" as any,
                                    params: { 
                                      id: evento.eventoID.toString(),
                                      transaccion: transaccion.transaccionID!.toString(),
                                      boleto: boleto.boletoID.toString()
                                    },
                                  })}
                                >
                                  <ButtonText>Ver Detalle</ButtonText>
                                </Button>
                              </VStack>
                            ) : (
                              <HStack space="md" className="items-center justify-between">
                                <VStack space="xs" className="flex-1">
                                  <Text className="font-bold text-md" style={{ color: "#00A76F" }}>
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
                                    params: { 
                                      id: evento.eventoID.toString(),
                                      transaccion: transaccion.transaccionID!.toString(),
                                      boleto: boleto.boletoID.toString()
                                    },
                                  })}
                                >
                                  <ButtonText>Ver Detalle</ButtonText>
                                </Button>
                              </HStack>
                            )}
                          </VStack>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </VStack>
              </VStack>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollView>
  );
}