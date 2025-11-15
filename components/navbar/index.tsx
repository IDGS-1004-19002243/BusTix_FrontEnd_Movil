import React from 'react';
import { View, Text, Pressable, useWindowDimensions, Platform } from 'react-native';
import type { NavbarProps } from './types';
import { navbarStyles } from './styles';
import { Button, ButtonIcon } from '@/components/ui/button';
import { MenuIcon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import UserProfile from './user-profile';
import Notifications from './notifications';

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const { isAuthenticated, role, email } = useSession();

  return (
    <View style={[navbarStyles.container, isMobile && { minHeight: 64 }]}>
      {/* Botón de menú para móvil */}
      {isMobile && (
        <Button 
          variant="solid" 
          size={Platform.OS === 'web' ? 'md' : 'lg'}
          action="secondary" 
          className={Platform.OS === 'web' ? 'bg-transparent px-2 h-8' : 'bg-transparent px-2'}
          onPress={onToggleSidebar}
        >
          <ButtonIcon 
            as={MenuIcon} 
            className={Platform.OS === 'web' ? 'w-6 h-6' : 'w-8 h-8'}
          />
        </Button> 
      )}

      {/* Espacio vacío para desktop */}
      {!isMobile && <View />}

      {/* Iconos de la derecha */}
      <View style={navbarStyles.rightIcons}>
        {isAuthenticated && role && email ? (
          <>
            <Notifications />
            <UserProfile />
          </>
        ) : (
          <Button
            variant="outline"
            size="md"
            onPress={() => router.push('/sign-in')}
          >
            <Text>Iniciar Sesion</Text>
          </Button>
        )}
      </View>
    </View>
  );
}