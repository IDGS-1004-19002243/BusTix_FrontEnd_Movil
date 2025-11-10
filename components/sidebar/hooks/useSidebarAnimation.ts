import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useSidebarAnimation = (isOpen: boolean, isMobile: boolean, sidebarWidth: number) => {
  const slideAnim = useRef(new Animated.Value(isOpen ? 0 : -sidebarWidth)).current;

  useEffect(() => {
    if (isMobile) {
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -sidebarWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, isMobile, sidebarWidth, slideAnim]);

  return slideAnim;
};