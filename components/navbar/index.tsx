import React from 'react';
import { View, Text, Pressable, useWindowDimensions, Platform } from 'react-native';
import type { NavbarProps } from './types';
import { navbarStyles } from './styles';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { MenuIcon } from '@/components/ui/icon';
import { User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import UserProfile from './user-profile';
import Notifications from './notifications';

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const { isAuthenticated, user } = useSession();

  return (
    <View style={[navbarStyles.container, isMobile && { minHeight: 64 }]}>
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

      {!isMobile && <View />}

      <View style={navbarStyles.rightIcons}>
        {isAuthenticated && user?.roles?.[0] && user?.email ? (
          <>
            <Notifications />
            <UserProfile />
          </>
        ) : (
          <Button
              variant="outline"
              size="sm"
              className="border-blue-500 data-[hover=true]:border-sky-100 data-[hover=true]:bg-sky-100 rounded-lg"
              onPress={() => router.push('/sign-in')}
            >
              <ButtonIcon as={User} className=" text-blue-500 data-[hover=true]:text-blue-500" />
              <ButtonText className="text-blue-500 data-[hover=true]:text-blue-500">Acceder</ButtonText>
            </Button>
        )}
      </View>
    </View>
  );
}