import React from "react";
import { Text, ScrollView, Pressable, useWindowDimensions, View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import Seo from "@/components/helpers/Seo";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useSession } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { getCategoryBgColor } from "@/components/eventos/hooks/useEventos";
import { PartyPopper as PartyPopperIcon, Drama as DramaIcon, Volleyball as VolleyballIcon,MicVocal as MicVocalIcon , CheckCircle as CheckCircleIcon } from 'lucide-react-native';

const getCategoryIcon = (category: string) => {
  const iconMap = {
    'Concierto': MicVocalIcon,
    'Teatro': DramaIcon,
    'Deportivo': VolleyballIcon,
    'Festival': PartyPopperIcon,
    'default': CheckCircleIcon,
  };
  const SelectedIcon = iconMap[category as keyof typeof iconMap] || iconMap.default;
  return <Icon as={SelectedIcon} className="text-typography-500 w-8 h-8" />;
};

export default function AuthenticatedHome() {
  const { user } = useSession();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const categories = ['Concierto', 'Teatro', 'Deportivo', 'Festival'];

  const hour = new Date().getHours();
  let greeting = "Buenos días";
  if (hour >= 12 && hour < 18) greeting = "Buenas tardes,";
  else if (hour >= 18) greeting = "Buenas noches,";
  const userName = user?.name || "Usuario,";

  return (
    <>
      <Seo title="Inicio" description="Bienvenido de vuelta a BusTix." />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        
        <Text className="text-black text-2xl mx-2 mb-8">
          {greeting} <Text className="font-bold">{userName}</Text>
        </Text>

        {/* 
          Contenedor flex que dispone los elementos en fila y permite envolver a la siguiente línea.
          - flex: Activa el layout Flexbox.
          - flex-row: Dirección horizontal (elementos uno al lado del otro).
          - flex-wrap: Permite que los elementos envuelvan a la siguiente línea si no caben.
        */}
        <View className="flex flex-row flex-wrap">
          {categories.map((item) => {

            {/* 
              Cada ítem ocupa un porcentaje del ancho del contenedor padre, determinando cuántos caben por fila.
              - w-1/2: 50% del ancho → Caben 2 ítems por fila (2 columnas en móvil).
              - w-1/3: ~33% del ancho → Caben 3 ítems por fila (3 columnas en desktop).
              - p-2: Padding de 8px alrededor de cada ítem para separación.

              No configuras "n columnas" directamente; Flexbox pone tantos como quepan, 
              y los extras bajan a la siguiente fila (por flex-wrap).
            */}
            const itemClassName = isMobile ? 'w-1/2 p-2' : 'w-1/3 p-2';
            return (
              <View key={item} className={itemClassName}>
                <Pressable onPress={() => router.push('/eventos')}>
                  <Card className={`p-6 ${getCategoryBgColor(item)}`}>
                    <VStack space="md">
                      <HStack className="justify-end">
                        {getCategoryIcon(item)}
                      </HStack>
                      <Text className="text-black text-lg font-semibold">{item}</Text>
                    </VStack>
                  </Card>
                </Pressable>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </>
  );
}