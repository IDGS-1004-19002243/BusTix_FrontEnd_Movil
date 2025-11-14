import React, { useState } from "react";
import { View, useWindowDimensions, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SIDEBAR_COLORS } from "./constants/sidebar-colors";
import type { SidebarProps } from "./content/type";
import { SidebarOverlay } from './overlay/SidebarOverlay';
import { SidebarHeader } from './parts/SidebarHeader';
import { SidebarBody } from './parts/SidebarBody'; 


export default function Sidebar({
  isOpen = true,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  slideAnim,
  panHandlers,
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<{
    [key: string]: boolean;
  }>({});
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const sidebarWidth = isMobile ? 230 : isCollapsed ? 90 : 260;

  const handleTogglePress = () => {
    setIsToggleHovered(false);
    if (isMobile) {
      onClose?.();
    } else {
      onToggleCollapse?.();
    }
  };

  const toggleSubmenu = (menuKey: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };


  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && (
        <SidebarOverlay
          isOpen={isOpen}
          slideAnim={slideAnim}
          sidebarWidth={sidebarWidth}
          onClose={onClose}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={{
          width: sidebarWidth,
          backgroundColor: SIDEBAR_COLORS.bg,
          borderRightWidth: 0.5,
          borderRightColor: SIDEBAR_COLORS.border,
          ...(isMobile ? { zIndex: 9 } : { zIndex: 1 }),
          ...(isMobile && {
            position: "absolute",
            top: insets.top,
            left: 0,
            bottom: insets.bottom,
            transform: [
              {
                translateX: slideAnim, // Desliza horizontalmente
              },
            ],
          }),
        }}
        {...(panHandlers && isMobile ? panHandlers : {})}
      >
        {/* Header fijo */}
        <SidebarHeader
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          onClose={onClose}
        />

        {/* Contenido scrolleable */}
        <SidebarBody
          isCollapsed={isCollapsed}
          expandedMenus={expandedMenus}
          onToggleSubmenu={toggleSubmenu}
        />
      </Animated.View>
    </>
  );
}
