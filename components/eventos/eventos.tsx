import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import { Card } from "@/components/ui/card";
import Seo from "@/components/helpers/Seo";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { styles } from "./styles";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import {
  formatDate,
  getCategoryColor,
  getGridConfig,
} from "./hooks/useEventos";

export default function Eventos({ eventos }: { eventos: any[] }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const gridConfig = getGridConfig(width, isMobile);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Seo
        title="Eventos"
        description="Descubre y reserva entradas para los mejores eventos."
      />
      <VStack space="lg">
        <Heading size="xl" className="text-center">
          Eventos Disponibles 🎭
        </Heading>
        <Text className="text-center text-gray-600 mb-4">
          Descubre y reserva entradas para los mejores eventos
        </Text>

        {eventos.length === 0 ? (
          <Text className="text-center text-gray-600 mt-8">
            No hay eventos disponibles en este momento
          </Text>
        ) : (
          <View style={[styles.gridContainer, { justifyContent: "center" }]}>
            {eventos.map((registro) => (
              <View
                key={registro.eventoID}
                style={[styles.cardWrapper, { width: gridConfig.cardWidth }]}
              >
                <Card
                  className="bg-white shadow-md"
                  style={
                    gridConfig.columns === 1 ? styles.cardMobile : styles.card
                  }
                >
                  {/* Imagen del evento */}
                  <Image
                    source={{ uri: registro.urlImagen }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />

                  {/* Contenido de la tarjeta */}
                  <VStack className="p-4" space="sm" style={styles.cardContent}>
                    <View style={styles.titleContainer}>
                      <Heading size="sm" numberOfLines={2}>
                        {registro.nombre}
                      </Heading>
                    </View>

                    {/* Categoría */}
                    <Badge
                      action={getCategoryColor(registro.tipoEvento)}
                      size="sm"
                      className="self-start"
                    >
                      <BadgeText className="text-xs">
                        {registro.tipoEvento}
                      </BadgeText>
                    </Badge>

                    {/* Información del evento */}
                    <VStack space="xs" className="">
                      <Text className="text-xs text-gray-600 mb-1">
                        📅 {formatDate(registro.fecha)}
                      </Text>
                      <Text className="text-xs text-gray-600" numberOfLines={1}>
                        📍{" "}
                        {registro.ciudad === registro.estado
                          ? registro.ciudad
                          : `${registro.ciudad}, ${registro.estado}`}
                      </Text>
                    </VStack>

                    {/* Botón de acción */}
                    <Button
                      size="sm"
                      className="w-full mt-auto"
                      onPress={() =>
                        router.push({
                          pathname: "/eventos/[id]" as any,
                          params: { id: registro.eventoID.toString() },
                        })
                      }
                    >
                      <ButtonText className="text-xs">Ver Detalles</ButtonText>
                    </Button>
                  </VStack>
                </Card>
              </View>
            ))}
          </View>
        )}
      </VStack>
    </ScrollView>
  );
}
