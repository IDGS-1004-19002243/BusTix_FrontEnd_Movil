import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import Seo from '@/components/helpers/Seo';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { useSession } from '@/context/AuthContext';

export default function HomePage() {
  const { signOut, role, email } = useSession();
  const [showModal, setShowModal] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Seo title="Inicio" description="Panel de control de BusTix: eventos, ventas y estadísticas." />
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
      >
        <VStack space="lg">
          <Heading size="xl" className="text-center text-black">Bienvenido a BusTix 👋</Heading>
          <Text className="text-center text-black mb-4">
            Gestiona tus eventos y boletos de manera fácil y rápida
          </Text>
          <Text className="text-center text-black mb-4">
            Rol: {role || 'Sin rol'}
          </Text>
          <Text className="text-center text-black mb-4">
            Email: {email || 'Sin email'}
          </Text>

          <HStack space="md" className="flex-wrap justify-center">
            <Card className="flex-1 min-w-[120px] max-w-[140px] bg-blue-50 border-blue-200 border-2">
              <VStack className="p-3 items-center">
                <Text className="text-2xl font-bold text-black">15</Text>
                <Text className="text-xs text-black text-center">Eventos Activos</Text>
              </VStack>
            </Card>
            <Card className="flex-1 min-w-[120px] max-w-[140px] bg-green-50 border-green-200 border-2">
              <VStack className="p-3 items-center">
                <Text className="text-2xl font-bold text-black">1,200</Text>
                <Text className="text-xs text-black text-center">Boletos Vendidos</Text>
              </VStack>
            </Card>
            <Card className="flex-1 min-w-[120px] max-w-[140px] bg-purple-50 border-purple-200 border-2">
              <VStack className="p-3 items-center">
                <Text className="text-2xl font-bold text-black">8</Text>
                <Text className="text-xs text-black text-center">Usuarios Registrados</Text>
              </VStack>
            </Card>
            <Card className="flex-1 min-w-[120px] max-w-[140px] bg-orange-50 border-orange-200 border-2">
              <VStack className="p-3 items-center">
                <Text className="text-xl font-bold text-black">$45,000</Text>
                <Text className="text-xs text-black text-center">Ingresos Totales</Text>
              </VStack>
            </Card>
          </HStack>
        
       
        
          <Card className="bg-white border-2 border-gray-300">
            <VStack className="p-6">
              <Heading size="lg" className="text-black mb-2">📅 Eventos Próximos</Heading>
              <Text className="text-gray-700 mb-4">No te pierdas estos eventos emocionantes</Text>
              <VStack space="sm">
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Concierto de Rock</Text>
                    <Text className="text-gray-600 text-sm">15 Nov, 8:00 PM - Estadio Nacional</Text>
                  </VStack>
                  <Badge action="success" size="sm">
                    <BadgeText>Disponible</BadgeText>
                  </Badge>
                </HStack>
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Festival de Jazz</Text>
                    <Text className="text-gray-600 text-sm">22 Nov, 7:00 PM - Parque Central</Text>
                  </VStack>
                  <Badge action="warning" size="sm">
                    <BadgeText>Últimas entradas</BadgeText>
                  </Badge>
                </HStack>
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Teatro Musical</Text>
                    <Text className="text-gray-600 text-sm">30 Nov, 6:00 PM - Teatro Principal</Text>
                  </VStack>
                  <Badge action="info" size="sm">
                    <BadgeText>Nuevo</BadgeText>
                  </Badge>
                </HStack>
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Ballet Clásico</Text>
                    <Text className="text-gray-600 text-sm">10 Nov, 5:00 PM - Teatro de la Ópera</Text>
                  </VStack>
                  <Badge action="muted" size="sm">
                    <BadgeText>Próximo</BadgeText>
                  </Badge>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          <Card className="bg-white border-2 border-gray-300">
            <VStack className="p-6">
              <Heading size="lg" className="text-black mb-2">🎟️ Ofertas Especiales</Heading>
              <Text className="text-gray-700 mb-4">Aprovecha estas promociones exclusivas</Text>
              <VStack space="sm">
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">20% descuento en boletos dobles</Text>
                    <Text className="text-gray-600 text-sm">Válido hasta fin de mes</Text>
                  </VStack>
                  <Badge action="success" size="sm">
                    <BadgeText>Activo</BadgeText>
                  </Badge>
                </HStack>
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Entrada gratis para estudiantes</Text>
                    <Text className="text-gray-600 text-sm">Presenta credencial universitaria</Text>
                  </VStack>
                  <Badge action="info" size="sm">
                    <BadgeText>Limitado</BadgeText>
                  </Badge>
                </HStack>
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Paquete familiar con 15% off</Text>
                    <Text className="text-gray-600 text-sm">Mínimo 4 personas, máximo descuento $50</Text>
                  </VStack>
                  <Badge action="warning" size="sm">
                    <BadgeText>Popular</BadgeText>
                  </Badge>
                </HStack>
                <HStack className="justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <VStack>
                    <Text className="text-black font-semibold">Compra anticipada 10% descuento</Text>
                    <Text className="text-gray-600 text-sm">Reservaciones con 15 días de anticipación</Text>
                  </VStack>
                  <Badge action="muted" size="sm">
                    <BadgeText>Nuevo</BadgeText>
                  </Badge>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          <HStack space="md" className="flex-wrap">
            <Card className="flex-1 min-w-[200px] border-2 border-gray-300">
              <VStack className="p-4">
                <Heading size="md" className="mb-2 text-black">🎪 Eventos Destacados</Heading>
                <VStack space="sm">
                  <Text className="text-sm text-black">• Ballet Clásico - 10 Nov</Text>
                  <Text className="text-sm text-black">• Stand Up Comedy - 18 Nov</Text>
                  <Text className="text-sm text-black">• Ópera Italiana - 25 Nov</Text>
                  <Text className="text-sm text-black">• Concierto Sinfónico - 5 Dic</Text>
                </VStack>
              </VStack>
            </Card>
            <Card className="flex-1 min-w-[200px] border-2 border-gray-300">
              <VStack className="p-4">
                <Heading size="md" className="mb-2 text-black">💰 Ofertas del Mes</Heading>
                <VStack space="sm">
                  <Text className="text-sm text-black">• Compra 3, paga 2</Text>
                  <Text className="text-sm text-black">• 30% descuento para grupos</Text>
                  <Text className="text-sm text-black">• Boleto VIP con cena incluida</Text>
                  <Text className="text-sm text-black">• Membresía anual con beneficios</Text>
                </VStack>
              </VStack>
            </Card>
            <Card className="flex-1 min-w-[200px] border-2 border-gray-300">
              <VStack className="p-4">
                <Heading size="md" className="mb-2 text-black">📊 Estadísticas</Heading>
                <VStack space="sm">
                  <Text className="text-sm text-black">• Satisfacción del cliente: 95%</Text>
                  <Text className="text-sm text-black">• Eventos este mes: 12</Text>
                  <Text className="text-sm text-black">• Nuevos usuarios: 45</Text>
                  <Text className="text-sm text-black">• Ciudades cubiertas: 8</Text>
                </VStack>
              </VStack>
            </Card>
          </HStack>
        </VStack>
    </ScrollView>

    <Modal isOpen={showModal} onClose={handleCloseModal}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">¡Bienvenido a BusTix! 🎉</Heading>
        </ModalHeader>
        <ModalBody>
          <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 16 }}>
            Gracias por usar nuestra aplicación. Aquí podrás gestionar tus boletos de manera fácil y rápida.
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Explora las secciones del menú lateral para comenzar.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleCloseModal}>
            <ButtonText>Empezar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}

