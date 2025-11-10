import { Animated } from 'react-native';
import { useRef } from 'react';
import { buildPanResponders } from './gestures/gesturesCore';

export const useSidebarGestures = (
  isSidebarOpen: boolean,
  setIsSidebarOpen: (value: boolean) => void,
  slideAnim: Animated.Value,
  sidebarWidth: number
) => {
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const { contentPanHandlers, sidebarPanHandlers } = buildPanResponders({
    isSidebarOpen,
    setIsSidebarOpen,
    slideAnim,
    sidebarWidth,
    indicatorAnim,
  });

  return {
    contentPanHandlers,
    sidebarPanHandlers,
    indicatorAnim,
  };
};
