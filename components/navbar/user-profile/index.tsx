import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar, AvatarFallbackText, AvatarImage, AvatarBadge } from '@/components/ui/avatar';
import { Pressable } from '@/components/ui/pressable';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import { Image } from '@/components/ui/image';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

// Función para truncar email
const truncateEmail = (email: string, maxLength: number = 20): string => {
  if (email.length <= maxLength) return email;
  return email.substring(0, maxLength) + '...';
};

// Función para obtener el color del badge según el rol
const getRoleBadgeAction = (role: string) => {
  const roleColors = {
    'admin': 'info',
    'staff': 'warning',
    'usuario': 'success',
  } as const;
  
  return roleColors[role.toLowerCase() as keyof typeof roleColors] || 'error';
};

// Función para obtener el texto del rol formateado
const getRoleText = (role: string): string => {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

const UserProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const userName = "Alexis Duran";
  const userEmail = "duranalexis209@gmail.com";
  const userRole = "Admin"; 

  return (
    <>
      <Menu
        offset={3}
        placement="bottom right"
        selectionMode="single"
        className="w-[200px]"
        onOpen={() => setIsMenuOpen(true)}
        onClose={() => setIsMenuOpen(false)}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable {...triggerProps}>
              <View className={isMenuOpen ? 'border border-outline-500  rounded-full p-1' : 'p-1'}>
                <Avatar size={Platform.OS === 'web' ? 'sm' : 'md'}>
                  <AvatarFallbackText>{userName}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                    }}
                  />
                  <AvatarBadge className="bg-success-500 border-background-0" />
                </Avatar>
              </View>
            </Pressable>
          );
        }}
      >
        <MenuItem 
          key="header" 
          textValue="header"
          disabled
          className={Platform.OS === 'web' 
            ? "px-2 py-1 cursor-default" 
            : "p-2"
          }
          style={{ 
            pointerEvents: 'none',
            opacity: 1,
            backgroundColor: 'transparent'
          }}
        >
          <View className="flex-row items-center">
            <Image
              size="xs"
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
              }}
              alt="User profile"
              className="rounded-full mr-2"
            />
            <View>
              <Badge 
                size="sm" 
                variant="solid" 
                action={getRoleBadgeAction(userRole)}
                style={{ alignSelf: 'flex-start' }}
              >
                <BadgeText className="font-bold" style={{ textTransform: 'none' }}>{getRoleText(userRole)}</BadgeText>
              </Badge>
              <Text className="text-xs text-typography-500">{truncateEmail(userEmail, 18)}</Text>
            </View>
          </View>
        </MenuItem>

        <MenuSeparator />

        <MenuItem 
          key="Profile" 
          textValue="Profile" 
          className={Platform.OS === 'web' ? "py-1 px-1" : "p-3"}
        >
          <MenuItemLabel size="sm">Profile</MenuItemLabel>
        </MenuItem>

        <MenuItem 
          key="Document" 
          textValue="Document" 
          className={Platform.OS === 'web' ? "py-1 px-1" : "p-3"}
        >
          <MenuItemLabel size="sm">Document</MenuItemLabel>
        </MenuItem>

      

        <MenuItem 
          key="Account" 
          textValue="Account" 
          className={Platform.OS === 'web' ? "py-1 px-1" : "p-3"}
        >
          <MenuItemLabel size="sm">Account</MenuItemLabel>
        </MenuItem>

        <MenuSeparator />

        <MenuItem 
          key="Logout" 
          textValue="Logout" 
          className={Platform.OS === 'web' ? "py-1 px-1" : "p-3"}
              onPress={() => router.push('/auth/login')}

        >
          <MenuItemLabel size="sm" className="text-warning-500">Logout</MenuItemLabel>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;