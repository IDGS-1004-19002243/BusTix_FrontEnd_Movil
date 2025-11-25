import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';

interface ExpiredSessionScreenProps {
  title?: string;
  heading?: string;
  message?: string;
  subMessage?: string;
  buttonText?: string;
}

export default function ExpiredSessionScreen({
  title = 'Sesión Expirada',
  heading = 'Sesión de compra expirada',
  message = 'Tu sesión de compra ha expirado o el enlace no es válido. Por favor, selecciona un evento nuevamente para continuar.',
  buttonText = 'Ver Eventos Disponibles'
}: ExpiredSessionScreenProps) {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title,
          headerLeft: router.canGoBack() ? undefined : () => (
            <TouchableOpacity onPress={() => router.push('/eventos')} className="p-2" activeOpacity={0.4}>
              <Image 
                source={require('@/assets/icons/back.png')}
                style={{ width: 24, height: 24, marginLeft: 11, marginRight: 3 }}
              />
            </TouchableOpacity>
          )
        }} 
      />
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <VStack space="lg" className="items-center max-w-md">
          <Heading size="lg" className="text-center">{heading}</Heading>
          <Text className="text-lg text-gray-600 text-center">
            {message}
          </Text>
          <VStack space="md" className="w-full mt-4">
            <Button onPress={() => router.push('/eventos')} size="lg">
              <ButtonText>{buttonText}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </View>
    </>
  );
}