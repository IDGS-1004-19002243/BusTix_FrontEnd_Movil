import React, { useState } from 'react';
import { View, Pressable, useWindowDimensions, ScrollView, Platform, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {  ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react-native';
import { SidebarContent } from './content';
import { styles as sidebarStyles } from './content/styles';
import { menuSections } from '../../config/menuData';
import { SIDEBAR_COLORS } from './constants/sidebar-colors';
import type { SidebarProps } from './content/type';
import { Button, ButtonIcon } from '@/components/ui/button';

export default function Sidebar({ isOpen = true, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  const handleTogglePress = () => {
    setIsToggleHovered(false);
    if (isMobile) {
      onClose?.();
    } else {
      onToggleCollapse?.();
    }
  };

  const toggleSubmenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // En móvil, si no está abierto, no renderizar
  if (isMobile && !isOpen) {
    return null;
  }

  const sidebarWidth = isMobile ? 230 : (isCollapsed ? 90 : 260);

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <Pressable
          onPress={onClose}
          style={{
            position: 'absolute',
            top: insets.top,
            left: 0,
            right: 0,
            bottom:insets.bottom,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 8,
          }}
        />
      )}

      {/* Sidebar */}
      <View
        style={{
          width: sidebarWidth,
          backgroundColor: SIDEBAR_COLORS.bg,
          borderRightWidth: 0.5,
          borderRightColor: SIDEBAR_COLORS.border,
          ...(isMobile && { zIndex: 9 }), // Solo en móvil
          ...(isMobile && {
            position: 'absolute',
            top: insets.top,
            left: 0,
            bottom:insets.bottom,
          }),
        }}
      >
        {/* Header fijo */}
        <View
          style={[
            sidebarStyles.headerContainer,
            { 
              marginBottom: isCollapsed ? 0 : 8,
              paddingLeft: 0,
              position: 'relative',
            }
          ]}
        >
          <View style={[
            sidebarStyles.logoWrapper, 
            isCollapsed && { 
              marginLeft: 9,
              flex: 1,
              alignItems: 'center',
            }
          ]}>
              <Image 
                source={require('@/assets/images/Logo_sidebar.png')}
                style={sidebarStyles.logoImage}
                resizeMode="cover"
              />
            {!isCollapsed && (
              <Text style={sidebarStyles.logoText}>
                Slash Admin
              </Text>
            )}
          </View>

          {/* Botón toggle - siempre en la esquina derecha */}
          {!isMobile && onToggleCollapse && (
            <View style={{ 
              position: 'absolute',
              right: -16,
              top: '50%',
              transform: [
                { translateY: -16 },
              ],
              // zIndex: 11,
            }}>
              <Button
                variant="solid"
                size={Platform.OS === 'web' ? 'md' : 'lg'}
                action="secondary"
                className={`bg-white px-2 border border-[#DFE3E8] rounded-md ${Platform.OS === 'web' ? 'h-8' : 'h-10'}`}
                onPress={handleTogglePress}
              >
                <ButtonIcon 
                  as={isCollapsed ? ArrowRightFromLine : ArrowLeftFromLine}
                  className={` ${Platform.OS === 'web' ? 'w-4 h-4' : 'w-5 h-5'}`}
                />
              </Button>
            </View>
          )}

          {/* Botón móvil en overlay - solo visible en móvil */}
          {isMobile && !isCollapsed && (
            <Button
              variant="solid"
              size={Platform.OS === 'web' ? 'md' : 'lg'}
              action="secondary"
              className={`bg-white px-2 border border-[#DFE3E8] rounded-md ${Platform.OS === 'web' ? 'h-8' : 'h-10'}`}
              onPress={handleTogglePress}
            >
              <ButtonIcon 
                as={ArrowLeftFromLine}
                className={Platform.OS === 'web' ? 'w-4 h-4' : 'w-5 h-5'}
              />
            </Button>
          )}
        </View>
        
        {/* Contenido scrolleable */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingTop: isCollapsed ? 0 : 2, 
            paddingLeft: isCollapsed ? 0 : 4, 
            marginLeft: isCollapsed ? 6 : 0, 
            marginRight: 0, 
            paddingRight: Platform.OS === 'ios' || Platform.OS === 'android' ? 8 : 0,
            paddingBottom: 8   
          }}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          <SidebarContent 
            sidebarOpen={!isCollapsed}
            menuSections={menuSections}
            expandedMenus={expandedMenus}
            onToggleSubmenu={toggleSubmenu}
            isCollapsed={isCollapsed}
          />
        </ScrollView>
      </View>
    </>
  );
}
