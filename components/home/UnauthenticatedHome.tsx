import React from "react";
import { Text, ScrollView, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import Seo from "@/components/helpers/Seo";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { useRouter } from "expo-router";

export default function UnauthenticatedHome() {
  const router = useRouter();

  return (
    <>
      <Seo
        title="Bienvenido a BusTix"
        description="Compra boletos para los mejores eventos. Descubre conciertos, teatro y más con BusTix."
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <VStack space="lg" className="items-center">
          <ImageBackground
            source={require("@/assets/images/hero-banner.jpg")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)"]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: 24,
              }}
            >
              <Heading size="lg" className="text-left text-white">
                Vive experiencias musicales inolvidables
              </Heading>
              <Text className="text-left text-white mt-2">
                Eventos de conciertos y festivales en México. Disfruta seguro,
                organizado y sin complicaciones.
              </Text>
              <Button
                onPress={() => router.push("/eventos")}
                className=" mt-4"
                action="positive"
              >
                <ButtonText className="text-white">
                  Explora próximos eventos
                </ButtonText>
              </Button>
            </LinearGradient>
          </ImageBackground>

          <VStack className="w-full p-6 mt-6">
            <HStack space="sm" className="justify-center items-center mb-4">
              <Heading
                size="lg"
                style={{ color: "#00A76F", fontWeight: "bold" }}
              >
                ¿Quiénes somos?
              </Heading>
            </HStack>
            <Text className="text-gray-700 text-center">
              Somos BusTix, una plataforma dedicada a conectar a los amantes
              de la música con los mejores eventos en México. Nuestra visión
              es hacer que cada experiencia sea memorable, segura y accesible.
              Ofrecemos boletos verificados, pagos confiables y un servicio al
              cliente excepcional.
            </Text>
            <Button className="mt-4 self-center" action="positive">
              <ButtonText className="text-white">
                Conoce más sobre nosotros
              </ButtonText>
            </Button>
          </VStack>

          <Divider className="my-4" />

          <VStack className="w-full p-6 mt-8 bg-gray-50">
            <HStack space="sm" className="justify-center items-center mb-4">
              <Heading
                size="lg"
                style={{ color: "#00A76F", fontWeight: "bold" }}
              >
                ¿Por qué elegir BusTix?
              </Heading>
            </HStack>
            <VStack space="sm">
              <Text className="text-gray-700">
                • Boletos seguros y verificados
              </Text>
              <Text className="text-gray-700">• Pagos rápidos y seguros</Text>
              <Text className="text-gray-700">• Acceso desde app móvil</Text>
              <Text className="text-gray-700">
                • Eventos exclusivos y ofertas
              </Text>
              <Text className="text-gray-700">• Reseñas de 5 estrellas</Text>
              <Text className="text-gray-700">• Compra en segundos</Text>
            </VStack>
          </VStack>

          <Divider className="my-4" />

          <VStack className="w-full p-6 mt-6">
            <HStack space="sm" className="justify-center items-center mb-4">
              <Heading
                size="lg"
                style={{ color: "#00A76F", fontWeight: "bold" }}
              >
                ¿Cómo comprar boletos?
              </Heading>
            </HStack>
            <VStack space="sm">
              <HStack space="sm" className="items-start">
                <Text className="text-md font-bold text-gray-700">1.</Text>
                <Text className="text-gray-700">
                  Regístrate o inicia sesión en BusTix.
                </Text>
              </HStack>
              <HStack space="sm" className="items-start">
                <Text className="text-md font-bold text-gray-700">2.</Text>
                <Text className="text-gray-700">
                  Explora eventos y selecciona tus boletos.
                </Text>
              </HStack>
              <HStack space="sm" className="items-start">
                <Text className="text-md font-bold text-gray-700">3.</Text>
                <Text className="text-gray-700">
                  Paga de forma segura y recibe tu entrada digital.
                </Text>
              </HStack>
            </VStack>
          </VStack>

          <Divider className="my-4" />

          <VStack className="w-full p-6 mt-6 bg-gray-50">
            <HStack space="sm" className="justify-center items-center mb-4">
              <Heading
                size="lg"
                style={{ color: "#00A76F", fontWeight: "bold" }}
              >
                Testimonios
              </Heading>
            </HStack>
            <VStack space="md">
              <VStack className="bg-white p-4 rounded-lg border border-gray-200">
                <Text className="text-gray-700 italic">
                  "¡Increíble app! Compré boletos para un concierto en
                  minutos."
                </Text>
                <Text className="text-gray-600 text-sm text-right mt-2">
                  - María G.
                </Text>
              </VStack>
              <VStack className="bg-white p-4 rounded-lg border border-gray-200">
                <Text className="text-gray-700 italic">
                  "Pagos seguros y eventos exclusivos. Altamente recomendado."
                </Text>
                <Text className="text-gray-600 text-sm text-right mt-2">
                  - Juan P.
                </Text>
              </VStack>
              <VStack className="bg-white p-4 rounded-lg border border-gray-200">
                <Text className="text-gray-700 italic">
                  "La mejor forma de disfrutar eventos. Fácil y rápido."
                </Text>
                <Text className="text-gray-600 text-sm text-right mt-2">
                  - Ana L.
                </Text>
              </VStack>
              <VStack className="bg-white p-4 rounded-lg border border-gray-200">
                <Text className="text-gray-700 italic">
                  "Nunca había sido tan sencillo comprar entradas."
                </Text>
                <Text className="text-gray-600 text-sm text-right mt-2">
                  - Carlos R.
                </Text>
              </VStack>
            </VStack>
          </VStack>

          <Divider className="my-4" />

          <VStack className="w-full p-6 mt-6">
            <HStack space="sm" className="justify-center items-center mb-4">
              <Heading
                size="lg"
                style={{ color: "#00A76F", fontWeight: "bold" }}
              >
                Preguntas Frecuentes
              </Heading>
            </HStack>
            <VStack space="sm">
              <Text style={{ color: "#00A76F", fontWeight: "600" }}>
                ¿Qué tipos de eventos puedo encontrar?
              </Text>
              <Text className="text-gray-600 text-sm">
                Conciertos, teatro, deportes, festivales y más. Siempre
                actualizando con nuevos eventos.
              </Text>
              <Text style={{ color: "#00A76F", fontWeight: "600" }} mt-4>
                ¿Hay descuentos disponibles?
              </Text>
              <Text className="text-gray-600 text-sm">
                Sí, ofertas exclusivas, descuentos para estudiantes y
                promociones especiales.
              </Text>
              <Text style={{ color: "#00A76F", fontWeight: "600" }} mt-4>
                ¿Puedo transferir mis boletos?
              </Text>
              <Text className="text-gray-600 text-sm">
                Dependiendo del evento, puedes transferir boletos a través de
                la app.
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </>
  );
}