import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSession } from "@/context/AuthContext";
import { usePurchase, generateSessionToken } from "@/context/PurchaseContext";
import {
  Alert,
  AlertText,
  AlertIcon,
} from "@/components/ui/alert";
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
import ReserveModal from "@/components/eventos/ReserveModal";
import AuthModal from "@/components/eventos/AuthModal";
import { Spinner } from "@/components/ui/spinner";

export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { setPurchaseData } = usePurchase();
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
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
  };

  const handleConfirm = () => {
    if (!event) return; // Asegurar que event no sea null

    // PASO 1: Validar que se haya seleccionado al menos 1 boleto
    if (quantity < 1) {
      // Si no hay boletos seleccionados, no hacer nada
      // TODO: Mostrar alerta al usuario indicando que debe seleccionar al menos 1 boleto
      return;
    }
    
    // PASO 2: Guardar la información de compra en el contexto
    // Esto permite compartir los datos entre esta página y la página de compra
    // Los datos expiran en 10 minutos
    // Si se reinicia la app, los datos se pierden
    
    // Generar token único de sesión para esta compra
    const sessionToken = generateSessionToken();
    
    // Convertir el nombre del evento a formato slug 
    // Ejemplo: "Copa Mundial FIFA 2026" → "copa-mundial-fifa-2026"
    const eventSlug = event.nombre
      .toLowerCase()                  // Convertir a minúsculas
      .normalize('NFD')               // Descomponer caracteres con acentos
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '')   // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-')           // Espacios a guiones
      .replace(/-+/g, '-')            // Múltiples guiones a uno solo
      .replace(/^-|-$/g, '');         // Quitar guiones al inicio/fin
    
    setPurchaseData({
      eventId: event.eventoID.toString(),  // ID del evento convertido a string
      eventSlug: eventSlug,                // Nombre en formato URL (slug)
      eventName: event.nombre,             // Nombre del evento
      eventImage: event.urlImagen || '',   // URL de la imagen del evento
      quantity: quantity,                  // Cantidad de boletos seleccionados
      pricePerTicket: 680,                 // Precio por boleto (hardcoded por ahora)
      sessionToken: sessionToken,          // Token único para validar en URL
      timestamp: Date.now(),               // Timestamp se añade automáticamente en setPurchaseData
    });
    
    // PASO 3: Cerrar el modal de confirmación
    setShowModal(false);
    
    // PASO 4: Navegar a la página de compra con eventSlug y token en la URL
    // Formato: /compra/[eventSlug]?token=[sessionToken]
    // Ejemplo: /compra/copa-mundial-fifa-2026?token=a3f9d2e1b4c8f7
    // 
    // Esto permite:
    // - Ver en la URL qué evento se está comprando
    // - Validar que el usuario tenga un token válido
    // - Prevenir acceso directo sin pasar por el flujo correcto
    // 
    router.push({
      pathname: '/compra/[slug]',
      params: { 
        slug: eventSlug,
        token: sessionToken 
      }
    });
  }; 
  
  if (loading) {
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
              <ButtonText>Reservar</ButtonText>
            </Button>
          </View>
        </HStack>
      </View>

      <ReserveModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        event={event}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onConfirm={handleConfirm}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          setTimeout(() => router.push("/sign-in"), 400);
        }}
      />
    </View>
  );
}
