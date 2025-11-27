import React from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { EventoUsuario } from "@/services/boletos/boletos.service";
import { styles } from "./styles";
import { getGridConfig } from "../eventos/hooks/useEventos";
import EventoCard from "./EventoCard";
import Seo from "@/components/helpers/Seo";
import { useRouter } from "expo-router";

interface WithTicketsProps {
  eventos: EventoUsuario[];
}

export default function WithTickets({ eventos }: WithTicketsProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const gridConfig = getGridConfig(width, isMobile);
  const router = useRouter();

  const handleVerBoletos = (evento: EventoUsuario) => {
    router.push({
      pathname: "/mis-boletos/[id]" as any,
      params: { id: evento.eventoID.toString() },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Seo
        title="Mis Boletos"
        description="Revisa tus boletos comprados para eventos."
      />
      <VStack space="lg">
        <Heading size="xl" className="text-center">
          Mis Eventos con Boletos 🎫
        </Heading>
        <Text className="text-center text-gray-600 mb-4">
          Eventos para los que tienes boletos comprados
        </Text>

        {eventos.length === 0 ? (
          <Text className="text-center text-gray-600 mt-8">
            No tienes boletos para ningún evento
          </Text>
        ) : (
          <View style={[styles.gridContainer, { justifyContent: "center" }]}>
            {eventos.map((evento) => (
              <View
                key={evento.eventoID}
                style={[styles.cardWrapper, { width: gridConfig.cardWidth }]}
              >
                <EventoCard
                  evento={evento}
                  onPressVerBoletos={handleVerBoletos}
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
