import React from "react";
import { Link, Stack } from "expo-router";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import { Platform } from 'react-native';
import Seo from '@/components/helpers/Seo';

export default function NotFoundScreen() {

  const Web = Platform.OS === 'web';

  return (
    <>
      {/* export options arriba para que otros desarrolladores las vean */}
      <Stack.Screen options={{ title: "¡Página no encontrada!", headerShown: !Web }} />
      {/* Use the Seo helper to set a page-specific title + description */}
      <Seo title="Página no encontrada" description="La página que buscas no existe." />
      <Center className="flex-1 px-4">
        <Text className="text-2xl font-bold mb-2 text-center text-black">
          ¡Página no encontrada!
        </Text>
        <Text className="text-base text-center mb-4 text-gray-700">
          La página que buscas no existe.
        </Text>
        <Image
          source={require("../assets/images/404.png")}
          style={{ width: 220, height: 220, marginBottom: 24 }}
          contentFit="contain"
          accessibilityLabel="404 imagen"
        />
        <Link href="/home" asChild>
          <Button size="lg" variant="solid" className="mt-2">
            <Text className="text-white">Ir al inicio</Text>
          </Button>
        </Link>
      </Center>
    </>
  );
}
