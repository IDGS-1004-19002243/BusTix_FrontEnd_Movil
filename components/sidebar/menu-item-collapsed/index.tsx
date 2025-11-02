import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  Menu,
  MenuItem as MenuItemComponent,
  MenuItemLabel,
} from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";
import { styles as sidebarStyles } from './styles';

import type { SidebarMenuItemCollapsedProps } from './types';

const SidebarMenuItemCollapsed: React.FC<SidebarMenuItemCollapsedProps> = ({ item, isParentActive }) => {
  const IconComponent = item.icon;
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handlePress = () => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const handleSubItemPress = (route?: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  const getContainerStyle = () => {
    return [
      sidebarStyles.container,
      isParentActive
        ? sidebarStyles.containerActive
        : isHovered
        ? sidebarStyles.containerHovered
        : sidebarStyles.containerNormal
    ];
  };

  const getLabelStyle = () => {
    return [
      sidebarStyles.label,
      isParentActive ? sidebarStyles.labelActive : sidebarStyles.labelNormal
    ];
  };

  if (item.hasSubmenu && item.submenu) {
    return (
      <Menu
        placement="right"
        offset={5}
        trigger={({ ...triggerProps }) => (
          <Pressable
            {...triggerProps}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            style={getContainerStyle()}
          >
            <View style={sidebarStyles.iconWrapper}>
              {IconComponent && (
                <IconComponent
                  size={22}
                  color={isParentActive ? sidebarStyles.iconActive.color : sidebarStyles.iconInactive.color}
                />
              )}
            </View>
            <Text style={getLabelStyle()}>{item.label}</Text>
            {item.badge && (
              <View style={sidebarStyles.badge}>
                <Text style={sidebarStyles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </Pressable>
        )}
      >
        {item.submenu.map((subItem: any, subIndex: number) => {
          const SubIcon = subItem.icon;
          return (
            <MenuItemComponent
              key={subIndex}
              textValue={subItem.label}
              onPress={() => handleSubItemPress(subItem.route)}
            >
              <Icon as={SubIcon} size="sm" className="mr-2" />
              <MenuItemLabel size="sm">{subItem.label}</MenuItemLabel>
            </MenuItemComponent>
          );
        })}
      </Menu>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={getContainerStyle()}
    >
      <View style={sidebarStyles.iconWrapper}>
        {IconComponent && (
          <IconComponent
            size={22}
            color={isParentActive ? sidebarStyles.iconActive.color : sidebarStyles.iconInactive.color}
          />
        )}
      </View>
      <Text style={getLabelStyle()}>{item.label}</Text>
      {item.badge && (
        <View style={sidebarStyles.badge}>
          <Text style={sidebarStyles.badgeText}>{item.badge}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default SidebarMenuItemCollapsed;
