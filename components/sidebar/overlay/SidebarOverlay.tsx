import React from 'react';
import { Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SidebarOverlayProps {
  isOpen: boolean;
  slideAnim: Animated.Value;
  sidebarWidth: number;
  onClose?: () => void;
}

export const SidebarOverlay: React.FC<SidebarOverlayProps> = ({
  isOpen,
  slideAnim,
  sidebarWidth,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top,
        left: 0,
        right: 0,
        bottom: insets.bottom,
        zIndex: 8,
        opacity: slideAnim.interpolate({
          inputRange: [-sidebarWidth, 0],
          outputRange: [0, 1],
        }),
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <Pressable onPress={onClose} style={{ flex: 1 }} />
    </Animated.View>
  );
};