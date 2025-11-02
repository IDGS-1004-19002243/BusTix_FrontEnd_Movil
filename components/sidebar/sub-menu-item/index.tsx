import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
import { usePathname } from 'expo-router';
import type { MenuItem } from '../../../types/sidebar.types';
import { styles as sidebarStyles } from './styles';
import type { SubMenuItemProps } from './type';

const SubMenuItemComponent: React.FC<SubMenuItemProps> = ({ subItem, onPress }) => {
  const [subHovered, setSubHovered] = useState(false);
  const pathname = usePathname();
  const SubIcon = subItem.icon;
  
  const normalizedSubRoute = subItem.route?.replace('/(pages)', '') || '';
  const isSubActive = normalizedSubRoute ? (pathname === normalizedSubRoute || pathname.startsWith(normalizedSubRoute + '/')) : false;

  const getContainerStyle = () => {
    if (isSubActive) {
      return [sidebarStyles.subMenuItem, sidebarStyles.subMenuItemActive];
    } else if (subHovered) {
      return [sidebarStyles.subMenuItem, sidebarStyles.subMenuItemHovered];
    } else {
      return [sidebarStyles.subMenuItem, sidebarStyles.subMenuItemNormal];
    }
  };

  return (
    <Pressable
      onPress={() => onPress(subItem.route)}
      onHoverIn={() => setSubHovered(true)}
      onHoverOut={() => setSubHovered(false)}
      style={getContainerStyle()}
    >
      <Text style={sidebarStyles.subMenuItemLabel}>
        {subItem.label}
      </Text>
    </Pressable>

  );
}

export default SubMenuItemComponent;
