import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Stack, useRouter } from 'expo-router';

interface AuthRequiredScreenProps {
  message?: string;
  buttonText?: string;
}

export default function AuthRequiredScreen({
  message = 'Debes iniciar sesión para comprar.',
  buttonText = 'Iniciar Sesión'
}: AuthRequiredScreenProps) {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Autenticación Requerida',
          headerLeft: router.canGoBack() ? undefined : () => (
            <TouchableOpacity onPress={() => router.push('/eventos')} className="p-2" activeOpacity={0.7}>
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
          <Text className="text-lg text-gray-600 text-center">{message}</Text>
          <VStack space="md" className="w-full mt-4">
            <Button onPress={() => router.push('/sign-in')} size="lg">
              <ButtonText>{buttonText}</ButtonText>
            </Button>
            <Button variant="outline" onPress={() => router.push('/eventos')} size="lg">
              <ButtonText>Ver Eventos Disponibles</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </View>
    </>
  );
}