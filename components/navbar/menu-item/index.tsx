import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { navbarMenuItemStyles } from './styles';
import type { NavbarMenuItemProps } from '../types';

export default function NavbarMenuItem({ icon, label, onPress }: NavbarMenuItemProps) {
  return (
    <Pressable style={navbarMenuItemStyles.container} onPress={onPress}>
      {icon && <View style={navbarMenuItemStyles.icon}>{icon}</View>}
      <Text style={navbarMenuItemStyles.label}>{label}</Text>
    </Pressable>
  );
}
