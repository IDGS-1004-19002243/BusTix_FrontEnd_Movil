import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSession } from "@/context/AuthContext";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert";
import {
  InfoIcon,
  ArrowLeftIcon,
  ShareIcon,
  FavouriteIcon,
} from "@/components/ui/icon";
import { apiGetEventoById } from "@/services/eventos";
import { Event } from "@/services/eventos/eventos.types";
import Seo from "@/components/helpers/Seo";
import EventDetailCard from "@/components/eventos/EventDetailCard";
import { Spinner } from "@/components/ui/spinner";

export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const eventData = await apiGetEventoById(id);
        setEvent(eventData);
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError(err.message || "Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleReserve = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowModal(true);
    }
  };  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Spinner size="large" color="green" />
        <Text className="text-lg text-gray-600 mt-4">Cargando evento...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Seo
          title="Evento no encontrado"
          description="El evento solicitado no existe."
        />
        <Text className="text-xl text-gray-600">
          {error || "Evento no encontrado"}
        </Text>
        <Button onPress={() => router.push("/eventos")} className="mt-4">
          <ButtonText>Volver</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Seo title={event.nombre} description={event.descripcion} />
      <View className="p-6">
        <Button
          onPress={() => router.push("/eventos")}
          variant="outline"
          className="self-start"
          size="sm"
        >
          <ButtonIcon as={ArrowLeftIcon} />
          <ButtonText>Volver</ButtonText>
        </Button>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
      >
        {showSuccess && (
          <Alert action="success" variant="solid" className="mb-4">
            <AlertIcon as={InfoIcon} />
            <AlertText>
              ¡Compra exitosa! {quantity} boleto(s) reservado(s).
            </AlertText>
          </Alert>
        )}

        <EventDetailCard event={event} />
      </ScrollView>

      <View className="bg-white p-4 rounded-lg">
        <HStack className="justify-between items-center">
          <HStack space="sm">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full p-3.5"
              onPress={() => {}}
            >
              <ButtonIcon as={ShareIcon} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full p-3.5"
              onPress={() => {}}
            >
              <ButtonIcon as={FavouriteIcon} />
            </Button>
          </HStack>
          <View className="flex flex-row items-center gap-3">
            <Text className="text-lg">
              <Text className="font-bold">Desde:</Text> $ 680
            </Text>
            <Button
              size="lg"
              onPress={handleReserve}
              disabled={event.estatus !== 1}
            >
              <ButtonText>Reservar Viaje</ButtonText>
            </Button>
          </View>
        </HStack>
      </View>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Reservar Viaje</Heading>
            <ModalCloseButton onPress={() => setShowModal(false)}>
              <Text>✕</Text>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text className="text-lg mb-4">
              ¿Confirmas la reserva de viaje para {event.nombre}?
            </Text>
            <VStack space="md" className="mb-4">
              <HStack className="items-center justify-center space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setQuantity(Math.max(0, quantity - 1))}
                  className="mr-2"
                >
                  <ButtonText>-</ButtonText>
                </Button>
                <Text className="text-lg font-semibold">
                  {quantity} boleto(s)
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setQuantity(quantity + 1)}
                  className="ml-2"
                >
                  <ButtonText>+</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onPress={() => setShowModal(false)}
              className="mr-2"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
                setShowSuccess(true);
              }}
            >
              <ButtonText>Confirmar Reserva</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Iniciar Sesión</Heading>
            <ModalCloseButton onPress={() => setShowAuthModal(false)}>
              <Text>✕</Text>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text className="text-lg mb-4">
              Para realizar una compra hay que iniciar sesión o registrarse.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onPress={() => setShowAuthModal(false)}
              className="mr-2"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={() => {
              setShowAuthModal(false);
              setTimeout(() => router.push("/sign-in"), 400);
            }}>
              <ButtonText>Ir a Iniciar Sesión</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}
