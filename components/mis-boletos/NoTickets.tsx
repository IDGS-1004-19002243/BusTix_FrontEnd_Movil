import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Ticket, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function NoTickets() {
  const router = useRouter();

  const handleGoToEvents = () => {
    router.replace('/(pages)/eventos');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <VStack space="lg" className="items-center max-w-sm">
        <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center">
          <Ticket size={48} color="#3B82F6" />
        </View>

        <Heading size="lg" className="text-center">No tienes boletos aún</Heading>

        <Text className="text-center text-gray-600">
          Parece que aún no has comprado ningún boleto. ¡Explora nuestros eventos disponibles y reserva tu viaje!
        </Text>

        <Button onPress={handleGoToEvents} className="w-full">
          <ButtonText className="flex-row items-center">
            Ver Eventos Disponibles
            <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </ButtonText>
        </Button>
      </VStack>
    </View>
  );
}