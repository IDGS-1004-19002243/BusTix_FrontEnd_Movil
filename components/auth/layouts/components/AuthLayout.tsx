import React from 'react';
import { View, useWindowDimensions, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import AuthHeader from './AuthHeader';
import { authStyles } from '../styles';
import { AuthLayoutProps } from '../types';
import { SIZES } from '../constants';

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < SIZES.mobileBreakpoint;

return (
  <View style={authStyles.container}>
    <View style={[authStyles.rowContainer, { flexDirection: isMobile ? 'column' : 'row' }]}>
      {/* Columna izquierda */}
      <View style={[authStyles.leftColumn, { width: isMobile ? '100%' : '50%', padding: isMobile ? 24 : 40, alignItems: isMobile ? 'center' : 'flex-start' }]}>
      
        <View style={[authStyles.headerWrapper, { alignItems: isMobile ? 'center' : 'flex-start' }]}>
          <AuthHeader isMobile={isMobile} />
        </View>

        <ScrollView
          style={[authStyles.scrollView, { flex: 1 }]}
          contentContainerStyle={[authStyles.scrollViewContent, { paddingHorizontal: isMobile ? 0 : 40 }]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.contentWrapper}>
            <Text className="text-2xl font-bold text-center mb-1 text-black">
              {title}
            </Text>
            <Text
              className="text-sm text-center mb-4"
              style={authStyles.subtitle}
            >
              {subtitle}
            </Text>
            {children}
          </View>
        </ScrollView>
      </View>

      {/* Columna derecha */}
      {!isMobile && (
        <View
          style={[authStyles.rightColumn, { width: '50%' }]}
        >
          <Image
            source={require('@/assets/images/Imagen_login.jpg')}
            style={authStyles.illustration}
            contentFit="cover"
            accessibilityLabel="Ilustración lateral de inicio de sesión"
          />
        </View>
      )}
    </View>
  </View>
);

}
 