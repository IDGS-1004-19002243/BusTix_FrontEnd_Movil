import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { apiGetEventos, Event } from "@/services/eventos";
import Seo from "@/components/helpers/Seo";
import Eventos from "@/components/eventos/eventos";
import { Spinner } from "@/components/ui/spinner";

export default function EventosPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [eventos, setEventos] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetEventos();
      setEventos(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Spinner size="large" color="green" />
        <Text className="text-lg text-gray-600 mt-4">Cargando eventos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <VStack space="lg" className="items-center">
          <Heading size="xl" className="text-center text-red-600 mx-8">
            Error
          </Heading>
          <Text className="text-center text-gray-600">{error}</Text>
          <Button onPress={loadEventos} size="md" action="positive">
            <ButtonText>Reintentar</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <>
      <Eventos eventos={eventos} />
    </>
  );
}
