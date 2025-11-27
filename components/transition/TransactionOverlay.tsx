import React, { FC, useEffect, useRef } from 'react';
import { View, Animated, Platform } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';

interface TransactionOverlayProps {
  duration?: number; // in ms
  onComplete?: () => void;
}

const TransactionOverlay: FC<TransactionOverlayProps> = ({
  duration = 2000,
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}
      >
        <VStack space="md" className="items-center">
          <Spinner size="large"  />
          <Text className="text-center text-2xl font-bold text-white">
            Transacción en proceso
          </Text>
          <Text className="text-center text-base text-white">
            {Platform.OS === 'web' ? 'No cierre la ventana por favor' : 'No cierre la aplicación por favor'}
          </Text>
        </VStack>
      </Animated.View>
    </View>
  );
};

export default TransactionOverlay;