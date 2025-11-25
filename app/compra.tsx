import React, { useState, useEffect } from 'react';
import { View, Alert, BackHandler, Platform, Pressable } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import { ArrowLeftIcon } from '@/components/ui/icon';

export const options = {
  title: 'Compra de Boletos',
  headerShown: true,
};

export default function CompraScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { isAuthenticated } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleFinish = () => {
    // Handle purchase completion
    console.log('Compra completada');
    router.push('/'); // Or to a success page
  };

  const handleBackPress = () => {
    Alert.alert(
      '¿Salir de la compra?',
      'Si sales ahora, perderás todo el progreso de la compra.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', onPress: () => router.back() },
      ]
    );
    return true; // Prevent default back action
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-lg text-gray-600">Debes iniciar sesión para comprar.</Text>
        <Button onPress={() => router.push('/sign-in')} className="mt-4">
          <ButtonText>Iniciar Sesión</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Compra de Boletos' }} />
      <View className="flex-1 bg-white">
      <ProgressSteps
        activeStepIconBorderColor="#2D2D2D"
        progressBarColor="#EBEBE4"
        completedProgressBarColor="#2D2D2D"
        activeStepIconColor="transparent"
        completedStepIconColor="#2D2D2D"
        disabledStepIconColor="#EBEBE4"
        labelColor="#D3D3D3"
        activeLabelColor="#2D2D2D"
        completedLabelColor="#2D2D2D"
        activeStepNumColor="#2D2D2D"
        completedStepNumColor="#2D2D2D"
        disabledStepNumColor="#FFFFFF"
        completedCheckColor="#FFFFFF"
      >
        <ProgressStep
          label="Seleccionar Boletos"
          buttonNextText="Siguiente"
          buttonFillColor="#2D2D2D"
          buttonNextTextColor="#FFFFFF"
        >
          <VStack className="p-6">
            <Heading size="md" className="mb-4">Seleccionar Cantidad de Boletos</Heading>
            <VStack space="md">
              <HStack className="items-center justify-center space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <ButtonText>-</ButtonText>
                </Button>
                <Text className="text-lg font-semibold">{quantity} boleto(s)</Text>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <ButtonText>+</ButtonText>
                </Button>
              </HStack>
              <Text className="text-center text-gray-600">
                Total: ${(quantity * 680).toFixed(2)}
              </Text>
            </VStack>
          </VStack>
        </ProgressStep>

        <ProgressStep
          label="Información de Pago"
          buttonNextText="Siguiente"
          buttonPreviousText="Anterior"
          buttonFillColor="#2D2D2D"
          buttonNextTextColor="#FFFFFF"
          buttonPreviousTextColor="#2D2D2D"
        >
          <VStack className="p-6">
            <Heading size="md" className="mb-4">Información de Pago</Heading>
            <VStack space="md">
              <Input>
                <InputField
                  placeholder="Número de Tarjeta"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
              </Input>
              <HStack space="md">
                <Input className="flex-1">
                  <InputField
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                </Input>
                <Input className="flex-1">
                  <InputField
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                  />
                </Input>
              </HStack>
              <Input>
                <InputField
                  placeholder="Nombre en la Tarjeta"
                  value={name}
                  onChangeText={setName}
                />
              </Input>
            </VStack>
          </VStack>
        </ProgressStep>

        <ProgressStep
          label="Confirmación"
          buttonFinishText="Confirmar Compra"
          onSubmit={handleFinish}
          buttonFillColor="#2D2D2D"
          buttonFinishTextColor="#FFFFFF"
        >
          <VStack className="p-6">
            <Heading size="md" className="mb-4">Confirmar Compra</Heading>
            <VStack space="md">
              <Text>Cantidad: {quantity} boleto(s)</Text>
              <Text>Total: ${(quantity * 680).toFixed(2)}</Text>
              <Text>Tarjeta: **** **** **** {cardNumber.slice(-4)}</Text>
              <Text>Nombre: {name}</Text>
            </VStack>
          </VStack>
        </ProgressStep>
      </ProgressSteps>
    </View>
    </>
  );
}