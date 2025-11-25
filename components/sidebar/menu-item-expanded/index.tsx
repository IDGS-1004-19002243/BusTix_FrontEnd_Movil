import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import type { SidebarMenuItemExpandedProps } from './type';
import SubMenuItemComponent from '../sub-menu-item';
import { styles as sidebarStyles } from './styles';

const SidebarMenuItemExpanded: React.FC<SidebarMenuItemExpandedProps> = ({
  item,
  isExpanded,
  isParentActive,
  onToggleSubmenu,
}) => {
  const IconComponent = item.icon;
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const handlePress = () => {
    if (item.hasSubmenu) {
      onToggleSubmenu();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  const handleSubItemPress = (route?: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  const getMainButtonStyle = () => {
    if (isParentActive && isHovered) {
      return [sidebarStyles.mainButton, sidebarStyles.mainButtonActiveHovered];
    } else if (isParentActive) {
      return [sidebarStyles.mainButton, sidebarStyles.mainButtonActive];
    } else if (isHovered) {
      return [sidebarStyles.mainButton, sidebarStyles.mainButtonHovered];
    } else {
      return [sidebarStyles.mainButton, sidebarStyles.mainButtonNormal];
    }
  };

  const getLabelStyle = () => {
    return [
      sidebarStyles.label,
      isParentActive ? sidebarStyles.labelActive : sidebarStyles.labelNormal
    ];
  };

  return (
  <View style={sidebarStyles.container}>
      <Pressable
        onPress={handlePress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
  style={getMainButtonStyle()}
      >
        <View style={sidebarStyles.leftContent}>
          <View style={sidebarStyles.iconWrapper}>
            {IconComponent && (
              <IconComponent 
                size={22} 
                color={isParentActive ? sidebarStyles.iconActive.color : sidebarStyles.iconInactive.color}
              />
            )}
          </View>
          <Text style={getLabelStyle()}>
            {item.label}
          </Text>
          {item.badge && (
            <View style={sidebarStyles.badge}>
              <Text style={sidebarStyles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        {item.hasSubmenu && (
          <View style={sidebarStyles.chevronWrapper}>
            {isExpanded ? (
              <ChevronDown
                size={16}
                color={isParentActive ? sidebarStyles.chevronColorActive.color : sidebarStyles.chevronColor.color}
              />
            ) : (
              <ChevronRight
                size={16}
                color={isParentActive ? sidebarStyles.chevronColorActive.color : sidebarStyles.chevronColor.color}
              />
            )}
          </View>
        )}
      </Pressable>

      {/* Submenu */}
      {item.hasSubmenu && isExpanded && item.submenu && (
        <View style={sidebarStyles.submenuContainer}>
          {item.submenu.map((subItem, subIndex) => (
            <SubMenuItemComponent
              key={subIndex}
              subItem={subItem}
              onPress={handleSubItemPress}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default SidebarMenuItemExpanded;
