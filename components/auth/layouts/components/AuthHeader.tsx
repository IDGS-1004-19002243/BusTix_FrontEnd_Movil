import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeaderStyle } from '../styles';
import { AuthHeaderProps } from '../types';
import { SIZES } from '../constants';

export default function AuthHeader({ isMobile }: AuthHeaderProps) {

  const HeaderContent = (
    <>
      <Image
        source={require('@/assets/images/Logo_sidebar.png')}
        style={{ width: SIZES.logoSize, height: SIZES.logoSize }}
        accessibilityLabel="Logo"
      />
      <Text className="text-md text-black ml-1">BusTix</Text>
    </>
  );

  return <View style={getHeaderStyle(isMobile)}>{HeaderContent}</View>;
}