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
import { apiGetViajes, apiGetViajeDetalleCliente, apiCalcularPrecio } from "@/services/viajes/viajes.service";
import { Event } from "@/services/eventos/eventos.types";
import { ViajeDetalleCliente } from "@/services/viajes/viajes.types";
import { apiReverseGeocode } from "@/services/geoapify";
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
  const [viajeDetalle, setViajeDetalle] = useState<ViajeDetalleCliente | null>(null);
  const [paradasWithCities, setParadasWithCities] = useState<any[]>([]);
  const [price, setPrice] = useState(0);
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

        // Intentar obtener los viajes asociados al evento
        // Esto es opcional, si falla, el evento se muestra sin precio
        try {
          // Llamar a la API para obtener la lista de viajes del evento
          const viajesData = await apiGetViajes(id);

          // Si hay al menos un viaje disponible
          if (viajesData.length > 0) {
            // Obtener el detalle completo del primer viaje (usando su ID)
            // Esto incluye precios, asientos disponibles, y lista de paradas
            const detalle = await apiGetViajeDetalleCliente(viajesData[0].viajeID);

            // Guardar el detalle del viaje en el estado para usarlo en la UI
            setViajeDetalle(detalle);

            // Si las ventas están abiertas y hay un precio base, guardarlo
            if (detalle.ventasAbiertas && detalle.precioDesde > 0) {
              setPrice(detalle.precioDesde);
            }

            // Si el viaje tiene por lo menos una parada definida
            if (detalle.paradas.length > 0) {
              // detalle.paradas es un array (lista) de objetos Parada.
              // .map() recorre cada parada y ejecuta una función async para cada una.
              // async significa que la función puede hacer tareas que toman tiempo (como llamadas a internet).
              // Para cada parada, se crea una "promesa" (Promise), que es como una tarea pendiente.
              // La promesa se crea automáticamente cuando se ejecuta la función async en .map().
              // Representa la tarea de obtener la ciudad, y se resuelve cuando la API responde.
              // Las peticiones HTTP a Geoapify se inician en este momento, cuando se llama a apiReverseGeocode dentro del .map().
              // Se hacen en paralelo: si hay 10 paradas, se lanzan 10 peticiones simultáneas al mismo tiempo.
              // Cada petición se resuelve en su propio tiempo (algunas rápidas, otras lentas), pero no bloquean a las demás.
              // El useEffect entero espera a que todas las operaciones async terminen (incluyendo estas peticiones),
              // durante ese tiempo, loading=true y se muestra el spinner de carga en la UI.
              const paradasPromises = detalle.paradas.map(async (parada) => {
                // Dentro de la función, se llama a apiReverseGeocode con latitud y longitud de la parada.
                // apiReverseGeocode hace una petición HTTP a Geoapify y devuelve el nombre de la ciudad.
                // await pausa la ejecución hasta que la petición termine y se obtenga la respuesta.
                const city = await apiReverseGeocode(parada.latitud, parada.longitud);

                // Luego, se usa el spread operator (...parada) para copiar todas las propiedades de la parada original
                // y se agrega la nueva propiedad 'city' con el valor obtenido.
                // El return devuelve el objeto parada enriquecido con la ciudad.
                return { ...parada, city };
              });

              // El resultado de .map() es un array de promesas (paradasPromises), no los resultados aún.
              // Promise.all() espera a que TODAS las promesas se resuelvan (es decir, todas las peticiones terminen).
              // Las peticiones se hacen en paralelo, no una por una, para ser más rápido.
              // await aquí pausa hasta que todas las respuestas lleguen, sin importar si algunas terminaron antes que otras.
              // Por ejemplo, si la petición 10 termina primero, Promise.all() aún espera a las demás (ej. petición 1 si es más lenta).
              // paradasWithCitiesData será un array con las paradas ya con 'city' agregado.
              const paradasWithCitiesData = await Promise.all(paradasPromises);

              // Finalmente, se guarda en el estado con setParadasWithCities.
              setParadasWithCities(paradasWithCitiesData);
            }
          }
        } catch (viajesError) {
          // Si algo falla en la obtención de viajes o detalles, ignorarlo
          // El evento se mostrará sin información de precio o paradas
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar el evento");
      } finally {
        setLoading(false); // Seaa éxito o error, dejar de cargar
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

  const handleConfirm = async (selectedParada: any) => {
    if (!event || !viajeDetalle || !selectedParada) return; // Asegurar que event no sea null

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
      pricePerTicket: 0,                   // Se calculará en el stepper
      viajeId: viajeDetalle.viajeID,       // ID del viaje
      paradaAbordajeId: selectedParada.paradaViajeID, // ID de la parada
      ciudadAbordaje: selectedParada.city, // Ciudad del punto de abordaje
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

        <EventDetailCard event={event} viajeDetalle={viajeDetalle} paradasWithCities={paradasWithCities} />
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
          {event.totalViajes === 0 ? (
            <View className="flex flex-row items-center gap-3">
              <Text className="text-lg text-gray-500">Sin Viajes</Text>
              <Button size="md" variant="solid" onPress={() => {}}>
                <ButtonText>Notificarme</ButtonText>
              </Button>
            </View>
          ) : viajeDetalle && !viajeDetalle.ventasAbiertas ? (
            <View className="flex flex-row items-center gap-3">
              <Text className="text-lg text-gray-500">Próximamente</Text>
              <Button size="md" variant="solid" onPress={() => {}}>
                <ButtonText>Notificarme</ButtonText>
              </Button>
            </View>
          ) : price > 0 ? (
            viajeDetalle && viajeDetalle.asientosDisponibles > 0 ? (
              <View className="flex flex-row items-center gap-3">
                <Text className="text-lg">
                  <Text className="font-bold">Desde:</Text> $ {price}
                </Text>
                <Button
                  size="lg"
                  onPress={handleReserve}
                  disabled={event.estatus !== 1}
                >
                  <ButtonText>Reservar</ButtonText>
                </Button>
              </View>
            ) : (
              <Text className="text-lg font-bold text-red-500">Agotado</Text>
            )
          ) : (
            <View className="flex flex-row items-center gap-3">
              <Text className="text-lg text-gray-500">No disponible</Text>
              <Button size="md" variant="solid" onPress={() => {}}>
                <ButtonText>Notificarme</ButtonText>
              </Button>
            </View>
          )}
        </HStack>
      </View>

      <ReserveModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        event={event}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onConfirm={handleConfirm}
        paradasWithCities={paradasWithCities}
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
