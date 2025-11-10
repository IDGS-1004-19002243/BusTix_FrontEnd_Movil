import { PanResponder, Animated } from 'react-native';
import {
  DEFAULT_GESTURE_EDGE,
  DEFAULT_OPEN_THRESHOLD,
  DEFAULT_VELOCITY_OPEN,
  DEFAULT_VELOCITY_DETECT,
  MIN_HORIZONTAL_MOVE,
  MAX_VERTICAL_MOVE,
  HORIZONTAL_DOMINANCE,
} from './gestureConfig';

type BuildParams = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  slideAnim: Animated.Value;
  sidebarWidth: number;
  indicatorAnim?: Animated.Value;
};

export function buildPanResponders({
  isSidebarOpen,
  setIsSidebarOpen,
  slideAnim,
  sidebarWidth,
  indicatorAnim,
}: BuildParams) {
  let initialPageX: number | null = null;
  const gestureEdge = Math.min(sidebarWidth, DEFAULT_GESTURE_EDGE);

  const contentPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt) => {
      initialPageX = evt.nativeEvent.pageX;
      return !isSidebarOpen && initialPageX < gestureEdge;
    },
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      const isFastSwipe = Math.abs(gestureState.vx) > DEFAULT_VELOCITY_DETECT;
      const hasHorizontalMovement = Math.abs(gestureState.dx) > MIN_HORIZONTAL_MOVE;
      const isMostlyHorizontal = hasHorizontalMovement && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * HORIZONTAL_DOMINANCE;
      // accept if fast swipe OR clearly horizontal (dominance), don't rely only on a small vertical-threshold
      return !isSidebarOpen && (isFastSwipe || isMostlyHorizontal);
    },
    onPanResponderGrant: (evt) => {
      slideAnim.stopAnimation();
      initialPageX = evt.nativeEvent.pageX;
    },
    onPanResponderMove: (_evt, gestureState) => {
      if (!isSidebarOpen && initialPageX !== null && initialPageX < gestureEdge) {
        const hasHorizontalMovement = Math.abs(gestureState.dx) > MIN_HORIZONTAL_MOVE;
        const isMostlyHorizontal = hasHorizontalMovement && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * HORIZONTAL_DOMINANCE;
        // only update slideAnim while the gesture is clearly horizontal
        if (isMostlyHorizontal) {
          const newValue = Math.max(-sidebarWidth, Math.min(0, -sidebarWidth + gestureState.dx));
          slideAnim.setValue(newValue);
        }
      }
    },
    onPanResponderRelease: (_evt, gestureState) => {
      if (!isSidebarOpen) {
        const startedFromLeft = initialPageX !== null && initialPageX < gestureEdge;
        if (startedFromLeft && (gestureState.dx > DEFAULT_OPEN_THRESHOLD || gestureState.vx > DEFAULT_VELOCITY_OPEN)) {
          // abrir
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setIsSidebarOpen(true));
        } else {
          // cerrar y mostrar indicador si el gesto no empezó desde el borde
          Animated.timing(slideAnim, { toValue: -sidebarWidth, duration: 300, useNativeDriver: true }).start();
          if (!startedFromLeft && indicatorAnim) {
            Animated.sequence([
              Animated.timing(indicatorAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
              Animated.timing(indicatorAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();
          }
        }
      }
    },
  });

  const sidebarPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      const isFastSwipe = Math.abs(gestureState.vx) > DEFAULT_VELOCITY_DETECT;
      const hasHorizontalMovement = Math.abs(gestureState.dx) > MIN_HORIZONTAL_MOVE;
      const isMostlyHorizontal = hasHorizontalMovement && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * HORIZONTAL_DOMINANCE;
      return isSidebarOpen && (isFastSwipe || isMostlyHorizontal);
    },
    onPanResponderGrant: () => slideAnim.stopAnimation(),
    onPanResponderMove: (_evt, gestureState) => {
      if (isSidebarOpen) {
        const hasHorizontalMovement = Math.abs(gestureState.dx) > MIN_HORIZONTAL_MOVE;
        const isMostlyHorizontal = hasHorizontalMovement && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * HORIZONTAL_DOMINANCE;
        if (isMostlyHorizontal) {
          const newValue = Math.max(-sidebarWidth, Math.min(0, gestureState.dx));
          slideAnim.setValue(newValue);
        }
      }
    },
    onPanResponderRelease: (_evt, gestureState) => {
      if (isSidebarOpen) {
        if (gestureState.dx < -50 || gestureState.vx < -0.5) {
          Animated.timing(slideAnim, { toValue: -sidebarWidth, duration: 300, useNativeDriver: true }).start(() => setIsSidebarOpen(false));
        } else {
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        }
      }
    },
  });

  return {
    contentPanHandlers: contentPanResponder.panHandlers,
    sidebarPanHandlers: sidebarPanResponder.panHandlers,
  };
}
