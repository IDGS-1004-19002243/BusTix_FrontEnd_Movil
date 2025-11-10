import { Slot } from 'expo-router';
import { View, useWindowDimensions, Animated, PanResponder } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';

export default function PagesLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();
  const sidebarWidth = 230;
  const slideAnim = useRef(new Animated.Value(isMobile ? (isSidebarOpen ? 0 : -sidebarWidth) : 0)).current;

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      Animated.timing(slideAnim, {
        toValue: isSidebarOpen ? 0 : -sidebarWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [isSidebarOpen, isMobile, slideAnim]);

  const contentPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { pageX } = evt.nativeEvent;
      return !isSidebarOpen && pageX < 100 && Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 20;
    },
    onPanResponderGrant: () => {
      slideAnim.stopAnimation();
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!isSidebarOpen) {
        const newValue = Math.max(-sidebarWidth, Math.min(0, gestureState.dx - sidebarWidth));
        slideAnim.setValue(newValue);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (!isSidebarOpen) {
        if (gestureState.dx > 50) {
          setIsSidebarOpen(true);
        } else {
          Animated.timing(slideAnim, {
            toValue: -sidebarWidth,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
    },
  });

  const sidebarPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return isSidebarOpen && Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 20;
    },
    onPanResponderGrant: () => {
      slideAnim.stopAnimation();
    },
    onPanResponderMove: (evt, gestureState) => {
      if (isSidebarOpen) {
        const newValue = Math.max(-sidebarWidth, Math.min(0, gestureState.dx));
        slideAnim.setValue(newValue);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (isSidebarOpen) {
        if (gestureState.dx < -50) {
          setIsSidebarOpen(false);
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

 
  return (
    <View style={{ flex: 1, flexDirection: 'row', paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Sidebar 
        isOpen={isMobile ? isSidebarOpen : true} 
        onClose={closeSidebar}
        isCollapsed={!isMobile && isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        slideAnim={slideAnim}
        panHandlers={sidebarPanResponder.panHandlers}
      />
      
      {/* Contenido principal */}
      <View style={{ flex: 1 }}>
        {/* Navbar */}
        <Navbar 
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* Contenido de las páginas */}
        <View style={{ flex: 1, backgroundColor: '#ffffff' }} {...contentPanResponder.panHandlers}>
          <Slot />
        </View>
      </View>
    </View>
  );
}
