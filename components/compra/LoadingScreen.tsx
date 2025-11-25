import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Cargando evento...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Spinner size="large" color="green" />
      <Text className="text-lg text-gray-600 mt-4">{message}</Text>
    </View>
  );
}